const { client } = require("../../../../config/pg");
const https = require("https");

module.exports = {
  //get all states
  async states(ctx) {
    try {
      const query = `
        SELECT
        s.id AS "stateID",
        s.state AS "state"
        FROM
        states s
      `;

      const data = await client.query(query);
      ctx.send(data.rows);
    } catch (error) {
      console.log(error);
    }
  },
  //get all tags
  async tags(ctx) {
    try {
      const query = `
        SELECT
        t.id AS "tagID",
        t.tag AS "tag"
        FROM
        tags t
      `;

      const data = await client.query(query);
      ctx.send(data.rows);
    } catch (error) {
      console.log(error);
    }
  },
  //store states for a user
  async addFilters(ctx) {
    try {
      //GET IDS of states
      const stateQuery = `
        SELECT
          s.id
        FROM
          states s
        WHERE
          s.state = ANY ($1)
        ORDER BY s.id
      `;
      //get states data
      const statedata = await client.query(stateQuery, [
        ctx.request.body.states,
      ]);
      //get states ids
      const stateids = statedata.rows.map((rows) => rows.id);

      //---------------------------------------------------------

      //GET IDs of tags
      const tagsQuery = `
        SELECT
          t.id
        FROM
          tags t
        WHERE
          t.tag = ANY ($1)
        ORDER BY t.id
      `;
      //get tags data
      const tagdata = await client.query(tagsQuery, [ctx.request.body.tags]);
      //get tags ids
      const tagids = tagdata.rows.map((rows) => rows.id);

      //----------------------------------------------------------------------

      const userID = parseInt(ctx.request.body.users);

      const filter = await strapi.query("api::filter.filter").findOne({
        users: userID,
      });

      if (filter) {
        console.log("Updating users filters");
        const entry = await strapi.entityService.update(
          "api::filter.filter",
          filter.id,
          {
            data: {
              user: [userID],
              states: stateids,
              tags: tagids,
            },
          }
        );
        ctx.send({
          message: "Filters updated successfully",
        });
      } else {
        console.log("Adding users and its filters");
        const newFilter = await strapi.entityService.create(
          "api::filter.filter",
          {
            data: {
              user: [userID],
              states: stateids,
              tags: tagids,
            },
          }
        );
        ctx.send({
          message: "Filters added successfully",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  //store states for a user
  async applyFilters(ctx) {
    try {
      const { data } = ctx.request.body;
      const { states, tags } = data;
      const { id } = ctx.request.params;

      const exists = await strapi.query('plugin::users-permissions.user').findOne({
        where: {
          id: id
        }
      });

      if(!exists){
        ctx.send({
          message: "User not found",
          code: 2
        },404);
        return;
      }

      var statesIDs = [];
      var tagsIDs = [];

      if (!states) {
        statesIDs = [];
      } else {
        for (let i = 0; i < states.length; i++) {
          const state = await strapi.query("api::state.state").findOne({
            where: { state: states[i] },
            select: "id",
          });
          if(state){
            statesIDs.push(state.id);
          }
        }
      }

      if (!tags) {
        tagsIDs = [];
      } else {
        for (let i = 0; i < tags.length; i++) {
          const tag = await strapi.query("api::tag.tag").findOne({
            where: { tag: tags[i] },
            select: "id",
          });
          if(tag){
            tagsIDs.push(tag.id);
          }
        }
      }

      const filterExists = await strapi.query("api::filter.filter").findOne({
        where: {
          users: id
        }
      })

      if(filterExists){
        const update = await strapi.query("api::filter.filter").update({
          where:{
            users: id
          },
          data:{
            states: statesIDs,
            tags: tagsIDs
          }
        });
      } else if(!filterExists){
        const insert = await strapi.query("api::filter.filter").create({
          data:{
            users: id,
            states: statesIDs,
            tags: tagsIDs
          }
        });
      }

      

      const opp = await strapi.query("api::opportunity.opportunity").findMany({
        where: {
          $or: [
            statesIDs.length > 0 ? { states: statesIDs } : {},
            tagsIDs.length > 0 ? { tags: tagsIDs } : {},
          ],
        },
        populate: {
          organization: {
            populate: true,
          },
          ratings: true,
          image: true,
        },
      });

      const save = await strapi.query("api::save.save").findMany({
        where: {
          users: id,
        },
      });

      const status = await strapi.query("api::opportunity-status.opportunity-status").findMany({
        where: {
          user: id,
        },
      });

      const oppArray = opp.map((o) => {
        const startOn = o.start_on ? new Date(o.start_on) : null;
        const endOn = o.end_on ? new Date(o.end_on) : null;
        let dateDiff = null;
        let avgRating = 0;

        if (startOn && endOn) {
          const yearDiff = endOn.getFullYear() - startOn.getFullYear();
          const monthDiff = endOn.getMonth() - startOn.getMonth();
          dateDiff =
            yearDiff > 0 ? `${yearDiff} year${yearDiff > 1 ? "s" : ""}` : "";
          dateDiff +=
            monthDiff > 0
              ? ` ${monthDiff} month${monthDiff > 1 ? "s" : ""}`
              : "";
        }

        if (o.ratings && o.ratings.length > 0) {
          const sumRatings = o.ratings.reduce(
            (acc, curr) => acc + curr.value,
            0
          );
          avgRating = sumRatings / o.ratings.length;
        }

        // Check if the opportunity is saved by the user
        const isSaved = !!save.find((s) => s.opportunity === o.id);
        const isApplied = !!status.find((a)=>a.opportunity === o.id)

        const userStatus = isApplied ? (status.length > 0 ? status[0].status : null) : null;

        return {
          organization_id: o.organization?.id || null,
          organization_logo: o.organization?.logo?.url || null,
          organization_name: o.organization?.name || null,
          opportunity_id: o.id || null,
          opportunity_profile: o.profile || null,
          opportunity_city: o.city || null,
          opportunity_image: o.image?.url || null,
          opportunity_duration: dateDiff,
          avg_rating: avgRating,
          organization_website: o.organization?.website || null,
          is_saved: isSaved,
          userStatus: userStatus
        };
      });

      ctx.send(
        {
          message: "Filter applied successfully",
          code: 1,
          data: oppArray,
        },
        200
      );
    } catch (error) {
      console.log(error);
    }
  },
};
