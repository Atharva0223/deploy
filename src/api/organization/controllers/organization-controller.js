module.exports = {
  //Get org detail
  async viewOrganization(ctx) {
    try {
      const view = await strapi
        .query("api::organization.organization")
        .findOne({
          where: {
            id: ctx.params.oid,
          },
          populate: {
            logo: { select: "url" },
            opportunities: {
              populate: true,
            },
            organization_users: true,
          },
        });

        const follow = await strapi.query('api::following.following').findMany({
          where: {
            organization: ctx.params.oid,
            users: ctx.params.uid
          },
        })

        var following;
        if(follow.length > 0){
          following = true;
        }
        if(follow.length <= 0){ 
          following = false;
        }

      //check if the organization exists or not
      if (!view) {
        ctx.send({
          message: "Organization not found",
          code: 2,
        });
      }
      if (view) {
        //get an array of opportunities
        const opp = [];
        for (let i = 0; i < view.opportunities.length; i++) {
          const image = view.opportunities[i].image?.url || null;
          const oppo = {
            id: view.opportunities[i].id,
            profile: view.opportunities[i].profile,
            image: image,
          };
          opp.push(oppo);
        }

        //get an array of organization_users
        const org_users = [];
        for (let i = 0; i < view.organization_users.length; i++) {
          const user = {
            id: view.organization_users[i].id || null,
            first_name: view.organization_users[i].first_name || null,
            last_name: view.organization_users[i].last_name || null,
          };
          org_users.push(user);
        }

        ctx.send({
          id: view.id,
          name: view.name,
          description: view.description,
          website: view.website,
          logo: view.logo.url,
          opportunities: opp,
          organizations_users: org_users,
          following: following
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
