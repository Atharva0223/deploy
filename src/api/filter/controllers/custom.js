const { client } = require("../../../../config/pg");
const https = require('https');

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
      const statedata = await client.query(stateQuery, [ctx.request.body.states]);
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

      const entry = await strapi.entityService.create('api::filter.filter', {
        data: {
          user: [userID],
          states: stateids,
          tags: tagids
        },
      });
      console.log(entry);
      
      ctx.send({
        message: "Filters added successfully"
      })
      
    } catch (error) {
      console.log(error);
    }
  },
};
