const { client } = require("../../../../config/pg");

module.exports = {
  //deleting an opportunity
  async find(ctx) {
    try {
      const query = `
      UPDATE
        opportunities
      SET
        is_deleted = true
      Where
        id = $1`;

      const data = await client.query(query, [ctx.params.id]);
      ctx.send("Record deleted sucessfully");
    } catch (error) {
      console.log(error);
    }
  },
};
