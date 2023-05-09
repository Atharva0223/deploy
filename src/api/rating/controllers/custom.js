const { client } = require("../../../../config/pg");

module.exports = {
  //Here the user will be able to seeall the applied opportunities
  async rating(ctx) {
    try {
      const data = ctx.request.body;
      const exists = await strapi.query("api::rating.rating").findOne({
        where: {
          users: data.users,
        },
      });

      if (!exists) {
        const add = await strapi.query("api::rating.rating").create({
          users: data.users,
          value: data.value,
          opportunity: data.opportunity,
        });
        ctx.send({
          message: "Rating added successfully",
        });
      } else if (exists) {
        const add = await strapi.query("api::rating.rating").update({
          where: {
            users: data.users,
          },
          data: {
            value: data.value,
            opportunity: data.opportunity,
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
};
