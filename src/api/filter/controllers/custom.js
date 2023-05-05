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
      const data = await client.query(stateQuery, [ctx.request.body.states]);
      console.log("Data received: ", data.rows);

      const ids = data.rows.map((rows) => rows.id);
      console.log("ids of states: ", ids);
      
      const userID = parseInt(ctx.request.body.users);
      console.log("type of userID ", typeof(userID),"value of userID ", userID);

      const entry = await strapi.entityService.create('api::filter.filter', {
        data: {
          user: [userID],
          states: ids
        },
      });
      console.log(entry);
      
      
    } catch (error) {
      console.log(error);
    }
  },
};
