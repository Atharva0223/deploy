const { client } = require("../../../../config/pg");

module.exports = {
  
  //Here the user will be able to see all the followers
  async getFollowers(ctx) {
    try {
      //from followers table get following people and organizations
      const getFollow = await strapi
        .query("api::following.following")
        .findMany({
          where: {
            users: ctx.params.id,
          },
        });

      if (getFollow.length <= 0) {
        ctx.send({
          message: "Currently you are not following anyone",
          code: 2,
        });
      } else if (getFollow.length > 0) {
        //fetch the people and store it in an array
        var people = [];
        for (let i = 0; i < getFollow.length; i++) {
          const getPeople = await strapi
            .query("plugin::users-permissions.user")
            .findMany({
              where: {
                id: getFollow[i].people,
              },
              populate: true,
            });
          if (getPeople.length) {
            people.push(getPeople);
          }
        }
        people = people.flat();

        //fetch the organizations and store it in an array
        var organization = [];
        for (let i = 0; i < getFollow.length; i++) {
          const getOrganization = await strapi
            .query("api::organization.organization")
            .findMany({
              where: {
                id: getFollow[i].organization,
              },
              populate: true,
            });
          if (getOrganization.length) {
            organization.push(getOrganization);
          }
        }
        organization = organization.flat();

        //parse the data to send it in ctx.send
        var sendPeople = [];
        for (let i = 0; i < people.length; i++) {
          const store = {
            id: people[i].id,
            profile_photo: people[i].profile_photo
              ? people[i].profile_photo.url
              : null,
            first_name: people[i].first_name,
            last_name: people[i].last_name,
          };
          sendPeople.push(store);
        }

        var sendOrganization = [];
        for (let i = 0; i < organization.length; i++) {
          const store = {
            id: organization[i].id,
            logo: organization[i].logo ? organization[i].logo.url : null,
            name: organization[i].name,
          };
          sendOrganization.push(store);
        }

        ctx.send({
          message: "Currently you are following",
          code: 1,
          sendPeople: sendPeople,
          sendOrganization: sendOrganization,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  //follow a person
  async followPerson(ctx) {
    try {
      const { users, people } = ctx.request.body;
      const query = `
SELECT
f.users AS "User",
f.people AS "People"
FROM followings f
WHERE f.users = $1 AND f.people = $2;
`;
      const data = await client.query(query, [users, people]);
      if (data.rows.length <= 0) {
        const query = `
INSERT INTO followings (users,people,created_at,updated_at) VALUES ($1,$2,now(),now());
`;

        const data = await client.query(query, [users, people]);

        ctx.send({
          message: "Following",
        });
      } else if (data.rows.length >= 0) {
        ctx.send({
          message: "Already following this person",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  //follow an organization
  async followOrganization(ctx) {
    try {
      const { users, organization } = ctx.request.body;
      const query = `
SELECT
f.users AS "User",
f.organization AS "Organization"
FROM followings f
WHERE f.users = $1 AND f.organization = $2;
`;
      const data = await client.query(query, [users, organization]);
      console.log(!data.rows.length == false);
      if (data.rows.length <= 0) {
        const query = `
INSERT INTO followings (users,organization,created_at,updated_at) VALUES ($1,$2,now(),now());
`;

        const data = await client.query(query, [users, organization]);

        ctx.send({
          message: "Following",
        });
      } else if (data.rows.length >= 0) {
        ctx.send({
          message: "Already following this organization",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  //unfollow a person
  async unfollowPerson(ctx) {
    try {
      const query = `
SELECT
f.users,
f.people
FROM followings f
WHERE f.users = $1 AND f.people = $2;
`;
      //id1 users, id2 people
      const data = await client.query(query, [ctx.params.id1, ctx.params.id2]);
      console.log(data.rows.length);
      if (data.rows.length > 0) {
        const query = `
DELETE FROM
followings
WHERE
users = $1 AND people = $2
`;

        const data = await client.query(query, [
          ctx.params.id1,
          ctx.params.id2,
        ]);

        ctx.send({
          message: "Unfollowed",
        });
      } else if (data.rows.length <= 0) {
        ctx.send({
          message: "Already unfollowed this person",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  //unfollow a person
  async unfollowOrganization(ctx) {
    try {
      const query = `
SELECT
f.users,
f.people
FROM followings f
WHERE f.users = $1 AND f.organization = $2;
`;
      //id1 users, id2 organization
      const data = await client.query(query, [ctx.params.id1, ctx.params.id2]);
      console.log(data.rows.length);
      if (data.rows.length > 0) {
        const query = `
DELETE FROM
followings
WHERE
users = $1 AND organization = $2
`;

        const data = await client.query(query, [
          ctx.params.id1,
          ctx.params.id2,
        ]);

        ctx.send({
          message: "Unfollowed",
        });
      } else if (data.rows.length <= 0) {
        ctx.send({
          message: "Already unfollowed this organization",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
