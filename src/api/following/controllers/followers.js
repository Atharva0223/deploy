const {client} = require("../../../../config/pg");

module.exports = {
//Here the user will be able to see all the followers
async getFollowers(ctx) {
  try {
    const query = `
    SELECT
      f.user AS "User",
      f.people AS "People",
      f.organization AS "Organization"
      FROM followings f
      WHERE f.user = $1
  `;

    const data = await client.query(query, [ctx.params.id]);
    ctx.send({
      data: data.rows,
    });
  } catch (error) {
    console.log(error);
  }
},
}