const { client } = require("../../../../config/pg");

module.exports = {
  //Finding opportunities using filters
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
