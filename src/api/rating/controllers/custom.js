const { client } = require("../../../../config/pg");

module.exports = {
  //Here the user will be able to seeall the applied opportunities
  async rating(ctx) {
    try {
      const { users, value, opportunity } = ctx.request.body.data;

      const exists = await strapi.query("api::rating.rating").findOne({
        where: { users, opportunity },
      });

      if (!exists) {
        const add = await strapi.query("api::rating.rating").create({
          data: {
            users: users,
            value: value,
            opportunity: opportunity,
          },
        });
        ctx.send({
          message: "Rating added successfully",
        });
      } else if (exists) {
        const add = await strapi.query("api::rating.rating").update({
          where: {
            users: users,
          },
          data: {
            value: value,
            opportunity: opportunity,
          },
        });
        ctx.send({
          message: "Rating updated successfully",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  async getRating(ctx) {
    const { oid, uid } = ctx.request.params;

    const exists = await strapi.query("api::rating.rating").findOne({
      where: {
        users: uid,
        opportunity: oid,
      },
    });
    if(exists){
      ctx.send({
        value: exists.value,
      })
    }
    else if(!exists) {
      ctx.send({
        message: "Rating not found"
      })
    }
  },
};
