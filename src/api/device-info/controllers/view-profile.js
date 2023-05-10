module.exports = {
  async viewProfile(ctx) {
    try {
      const exists = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: ctx.params.id,
          },
          populate: {
            profile_photo: true,
          },
        });

      const opportunity_status = await strapi
        .query("api::opportunity-status.opportunity-status")
        .findMany({
          where: {
            user: ctx.params.id,
          },
          select: ["opportunity"],
        });

      const opp = await strapi.query("api::opportunity.opportunity").findMany({
        where: {
          id: opportunity_status.map((o) => o.opportunity),
        },
        populate: {
          image: true,
        },
      });

      var opportunities = [];

      for (let i = 0; i < opp.length; i++) {
        const dateOptions = { day: "numeric", month: "short", year: "numeric" }; // options for formatting the date
        const startDate = new Date(opp[i].start_on).toLocaleDateString(
          "en-US",
          dateOptions
        ); // convert start_on to formatted string
        const endDate = new Date(opp[i].end_on).toLocaleDateString(
          "en-US",
          dateOptions
        ); // convert end_on to formatted string

        const arr = {
          id: opp[i].id,
          image: opp[i].image.url,
          profile: opp[i].profile,
          city: opp[i].city,
          start_on: startDate,
          end_on: endDate,
        };
        opportunities.push(arr);
      }

      console.log(opportunities);

      ctx.send({
        data: {
          profile_photo: exists.profile_photo.url,
          first_name: exists.first_name,
          last_name: exists.last_name,
          bio: exists.bio,
          about_me: exists.about_me,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
};
