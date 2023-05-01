const { client } = require("../../../../config/pg");

module.exports = {
  //deleting an opportunity
  async find(ctx) {
    try {
      const query = `
        //todo
      `;

      const data = await client.query(query, [ctx.params.ids]);
      ctx.send(data.rows);
    } catch (error) {
      console.log(error);
    }
  },
};
