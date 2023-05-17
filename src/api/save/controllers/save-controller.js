const { client } = require("../../../../config/pg");
const constants = require("../../../../helpers/constants.json");
module.exports = {
  //This will fetch all the saved opportunities of a user
  async saved(ctx) {
    try {
      const exists = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: ctx.params.id,
          },
          populate: {
            profile_photo: true,
          },
        });

      //if the user exists then send the profile details
      if (exists) {
        //fetch save status of opportunities
        const saved_opportunities = await strapi
          .query("api::save.save")
          .findMany({
            where: {
              users: ctx.params.id,
            },
            select: ["opportunity"],
          });

        //fetch opportunity status
        const opportunity_status = await strapi
          .query("api::opportunity-status.opportunity-status")
          .findMany({
            where: {
              user: ctx.params.id,
            },
            select: ["opportunity", "status", "approved"],
          });

        //fetch opportunities
        const opp = await strapi
          .query("api::opportunity.opportunity")
          .findMany({
            where: {
              id: opportunity_status.map((o) => o.opportunity),
            },
            populate: {
              image: true,
              ratings: true,
              status: true,
              organization: {
                populate: true,
              },
            },
          });

        //init an array to store
        var opportunities = [];

        //for loop to store the opportunities details in an array
        for (let i = 0; i < opp.length; i++) {
          //check saved status of all the opportunities the user has applied to
          const savedOpportunity = saved_opportunities.find(
            (o) => o.opportunity === opp[i].id
          );

          //save the saved status of that opportunity in "saved"
          const saved = savedOpportunity ? true : false;

          // Add an if statement to check if the opportunity is saved or not
          if (saved) {
            //fetching the ratings of each opportunities that the user has applied for
            const ratings = opp[i].ratings;
            let sum = 0;
            for (let j = 0; j < ratings.length; j++) {
              sum += ratings[j].value;
              // Access other properties as needed
            }

            //getting the average rating
            const avgRating = sum / ratings.length;

            //converting the start_on and end_on dates into new Date objects
            const start = new Date(opp[i].start_on);
            const end = new Date(opp[i].end_on);

            // fetching the differece of start_on and end_on dates
            const yearsDiff = end.getFullYear() - start.getFullYear();
            const monthsDiff = end.getMonth() - start.getMonth();
            const duration = `${yearsDiff} years, ${monthsDiff} months`;

            //fetching the status of each opportunity (waiting completed ongoing)
            const statusObj = opportunity_status.find(
              (o) => o.opportunity === opp[i].id
            );
            const status = statusObj ? statusObj.status : null;
            const approved = statusObj ? statusObj.approved : null;

            // storing all of the above data in arr
            const arr = {
              saved: saved,
              opportunity_id: opp[i].id,
              opportunity_image: opp[i].image ? opp[i].image.url : null,
              opportunity_profile: opp[i].profile,
              opportunity_city: opp[i].city,
              opportunity_duration: duration,
              opportunity_rating: avgRating, // Add rating property to the object
              opportunity_status: status,
              opportunity_approved: approved, // Add the approved property to the object
              organization_id: opp[i].organization.id,
              organization_name: opp[i].organization.name,
              organization_website: opp[i].organization.website,
              organization_logo_url: opp[i].organization.logo
                ? opp[i].organization.logo.url
                : null, // Add the logo URL to the object
            };

            //pushing the arr in opportunities
            opportunities.push(arr);
          }
        }

        if (opportunities.length > 0) {
          ctx.send({
            data: opportunities,
          });
        } else if (opportunities.length <= 0) {
          ctx.send(
            {
              message: constants.recordNotFound,
              code: 1,
            },
            404
          );
        }

        //sending the profile details as well as opportunitie details
      }
      //if user dosent exist send message and code 2
      else if (!exists) {
        ctx.send(
          {
            message: "profile not found",
            code: 2,
          },
          404
        );
      }
    } catch (error) {
      console.log(error);
    }
  },

  //This will unsave a post
  async unsave(ctx) {
    try {
      //check if saved opportunity exists?
      const query = `
      SELECT s.id,s.save
      FROM saves s
      WHERE s.opportunity = $1 AND s.users = $2
    `;
      //                                            opportunity id  user id
      const data = await client.query(query, [ctx.params.id1, ctx.params.id2]);

      console.log(!data.rows.length);

      // ifsaved opportunity exists then delete
      if (!data.rows.length == false) {
        const query = `
        DELETE FROM saves s
        WHERE s.opportunity = $1 AND s.users = $2
      `;
        //                                            opportunity id  user id
        const data = await client.query(query, [
          ctx.params.id1,
          ctx.params.id2,
        ]);

        ctx.send({
          message: "Opportunity unsaved",
        });
      }
      //else if saved opportunity dosent exists then send message already deleted
      else if (!data.rows.length == true) {
        ctx.send({
          message: "Opportunity already unsaved",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  //This will save a post
  async save(ctx) {
    try {
      const query = `
      SELECT s.id, s.save
      FROM saves s
      WHERE s.opportunity = $1 AND s.users = $2
      ORDER BY s.id DESC
    `;
      //                                            opportunity id  user id
      const data = await client.query(query, [ctx.params.id1, ctx.params.id2]);

      if (!data.rows.length == false) {
        ctx.send({
          message: "Opportunity is already saved",
        });
      } else if (!data.rows.length == true) {
        const query = `
        INSERT INTO saves (save,opportunity,users,created_at,updated_at) VALUES (true,$1,$2,now(),now())
        `;
        const data = await client.query(query, [
          ctx.params.id1,
          ctx.params.id2,
        ]);

        ctx.send({
          message: "Opportunity saved",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
