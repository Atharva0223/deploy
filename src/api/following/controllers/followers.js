const {client} = require("../../../../config/pg");

module.exports = {
//Here the user will be able to see all the followers
async getFollowers(ctx) {
  try {
    const query = `
    SELECT
      f.users AS "User",
      f.people AS "People",
      f.organization AS "Organization"
      FROM followings f
      WHERE f.users = $1
  `;

    const data = await client.query(query, [ctx.params.id]);
    ctx.send({
      data: data.rows,
    });
  } catch (error) {
    console.log(error);
  }
},
//follow an organization or person
async followPerson(ctx) {
  try {
    const{users,people} = ctx.request.body;
    const query = `
    SELECT
    f.users AS "User",
    f.people AS "People"
    FROM followings f
    WHERE f.users = $1 AND f.people = $2;
  `;
    const data = await client.query(query,[users,people]);
    console.log(data.rows.length);
    // if(data.rows.length<=0){
    //   const query = `
    //   INSERT INTO followings (users,people) VALUES ($1,$2);
    //   `;

    //   const data = await client.query(query,[users,people]);

    //   console.log(data.rows);
    //   ctx.send({
    //     message: "Following"
    //   })
    // }
    // else if (data.rows.length>=0){
    //   ctx.send({
    //     message: "Already following this person"
    //   })
    // }
    // ctx.send({
    //   data: data.rows,
    // });
  } catch (error) {
    console.log(error);
  }
},
}