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
//follow a person
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
    console.log(!data.rows.length==false);
    if(data.rows.length<=0){
      const query = `
      INSERT INTO followings (users,people,created_at,updated_at) VALUES ($1,$2,now(),now());
      `;

      const data = await client.query(query,[users,people]);

      ctx.send({
        message: "Following"
      })
    }
    else if (data.rows.length>=0){
      ctx.send({
        message: "Already following this person"
      })
    }
  } catch (error) {
    console.log(error);
  }
},
//follow an organization
async followOrganization(ctx) {
  try {
    const{users,organization} = ctx.request.body;
    const query = `
    SELECT
    f.users AS "User",
    f.organization AS "Organization"
    FROM followings f
    WHERE f.users = $1 AND f.organization = $2;
  `;
    const data = await client.query(query,[users,organization]);
    console.log(!data.rows.length==false);
    if(data.rows.length<=0){
      const query = `
      INSERT INTO followings (users,organization,created_at,updated_at) VALUES ($1,$2,now(),now());
      `;

      const data = await client.query(query,[users,organization]);

      ctx.send({
        message: "Following"
      })
    }
    else if (data.rows.length>=0){
      ctx.send({
        message: "Already following this organization"
      })
    }
  } catch (error) {
    console.log(error);
  }
},
}