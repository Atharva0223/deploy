module.exports = {
  //Get org detail
  async viewOrganization(ctx) {
    try {
      id = ctx.params.id;
      const view = await strapi
        .query("api::organization.organization")
        .findOne({
          where: {
            id,
          },
          populate: {
            logo: { select: "url" },
            opportunities: {
              populate: true,
            },
            organization_users: true,
          },
        });


        const [opportunities, organizations_users] = await Promise.all([
          view.opportunities?.map(async (opportunity) => ({
            id: opportunity.id,
            profile: opportunity.profile,
            image: opportunity.image.url,
          })),
          view.organizations_users?.map(async (users) => ({
            id: users.id,
            first_name: users.first_name,
            last_name: users.last_name,
            // profile_photo: users.profile_photo.url,
          })),
        ]);
        

        console.log("opportunities", opportunities.Promise,"organizations_users",organizations_users);

      // // initialize empty opportunities array
      // const opportunities = [];

      // view.opportunities.forEach((opportunity) => {
      //   const opportunityObj = {
      //     id: opportunity.id,
      //     profile: opportunity.profile,
      //     image: opportunity.image.url,
      //   };

      //   // push opportunity object into opportunities array
      //   opportunities.push(opportunityObj);
      // });

      // // initialize empty organzation users array
      // const organizations_users = [];

      // view.organizations_users.forEach((users) => {
      //   const usersObj = {
      //     id: users.id,
      //     first_name: users.first_name,
      //     last_name: users.last_name,
      //     // profile_photo: users.profile_photo.url,
      //   };

      //   // push organizations_users object into organizations_users array
      //   organizations_users.push(usersObj);
      // });

      // console.log(organizations_users);

      ctx.send({
        id: view.id,
        name: view.name,
        description: view.description,
        website: view.website,
        logo: view.logo.url,
        // opportunities: opportunities,
        // organizations_users: organizations_users,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
