module.exports = {
  //Here the user will be able to seeall the applied opportunities
  async rating(ctx) {
    try {
      const { users, value, opportunity } = ctx.request.body.data;

      const rating = await strapi.query("api::rating.rating").findOne({
        where: {
          $and: [{ users }, { opportunity }],
        },
      });

      if (value > 5 || value < 0) {
        console.log("value greater than 5");
        ctx.send({
          message: "Please enter a value between 0 and 5",
          code: 2,
        });
      } else {
        if (rating) {
          const update = await strapi.query("api::rating.rating").update({
            where: {
              $and: [{ users: users }, { opportunity: opportunity }],
            },
            data: {
              value: value,
            },
          });
          ctx.send({
            message: "Rating updated successfully",
          });
        } else if (!rating) {
          const create = await strapi.query("api::rating.rating").create({
            data: {
              users: users,
              value: value,
              opportunity: opportunity,
            },
          });
          ctx.send({
            message: "Rating added successfully",
          });
        }
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
    if (exists) {
      ctx.send({
        value: exists.value,
      });
    } else if (!exists) {
      ctx.send({
        value: 0,
      });
    }
  },
};
