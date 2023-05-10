module.exports = {
  async viewProfile(ctx) {
    try {
      // if user exists fetch data
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

        //if the user exists then send the profile details
      if (exists) {

        //fetch save status of opportunities
        const saved_opportunities = await strapi
          .query("api::save.save")
          .findMany({
            where: {
              users: ctx.params.id,
            },
            select: ["opportunity"],
          });

        //fetch opportunity status
        const opportunity_status = await strapi
          .query("api::opportunity-status.opportunity-status")
          .findMany({
            where: {
              user: ctx.params.id,
            },
            select: ["opportunity", "status"],
          });

        //fetch opportunities
        const opp = await strapi
          .query("api::opportunity.opportunity")
          .findMany({
            where: {
              id: opportunity_status.map((o) => o.opportunity),
            },
            populate: {
              image: true,
              ratings: true,
              status: true,
              organization: {
                populate: true,
              },
            },
          });

        //init an array to store
        //opportunity_id: opp[i].id,
        //opportunity_image: opp[i].image.url,
        //opportunity_profile: opp[i].profile,
        //opportunity_city: opp[i].city,
        //opportunity_duration: duration,
        //opportunity_rating: avgRating, // Add rating property to the object
        //opportunity_status: status,
        //organization_id: opp[i].organization.id,
        //organization_name: opp[i].organization.name,
        //organization_website: opp[i].organization.website,
        //organization_logo_url: opp[i].organization.logo ? opp[i].organization.logo.url : null // Add the logo URL to the object
        var opportunities = [];

        //for loop to store the opportunities details in an array
        for (let i = 0; i < opp.length; i++) {

          //check saved status of all the opportunities the user has applied to
          const savedOpportunity = saved_opportunities.find(
            (o) => o.opportunity === opp[i].id
          );

          //save the saved status of that opportunity in "saved" 
          const saved = savedOpportunity ? true : false;
          opp[i] = {
            ...opp[i],
            saved: saved,
          };

          //fetching the ratings of each opportunities that the user has applied for
          const ratings = opp[i].ratings;
          let sum = 0;
          for (let j = 0; j < ratings.length; j++) {
            sum += ratings[j].value;
            // Access other properties as needed
          }

          //getting the average rating
          const avgRating = sum / ratings.length;

          //converting the start_on and end_on dates into new Date objects
          const start = new Date(opp[i].start_on);
          const end = new Date(opp[i].end_on);

          // fetching the differece of start_on and end_on dates
          const yearsDiff = end.getFullYear() - start.getFullYear();
          const monthsDiff = end.getMonth() - start.getMonth();
          const duration = `${yearsDiff} years, ${monthsDiff} months`;

          //fetching the status of each opportunity (waiting completed ongoing)
          const status = opportunity_status.find(
            (o) => o.opportunity === opp[i].id
          )?.status; // Find the status for the current opportunity

          // storing all of the above data in arr
          const arr = {
            saved: saved,
            opportunity_id: opp[i].id,
            opportunity_image: opp[i].image.url,
            opportunity_profile: opp[i].profile,
            opportunity_city: opp[i].city,
            opportunity_duration: duration,
            opportunity_rating: avgRating, // Add rating property to the object
            opportunity_status: status,
            organization_id: opp[i].organization.id,
            organization_name: opp[i].organization.name,
            organization_website: opp[i].organization.website,
            organization_logo_url: opp[i].organization.logo
              ? opp[i].organization.logo.url
              : null, // Add the logo URL to the object
          };

          //pushing the arr in opportunities
          opportunities.push(arr);
        }

        //sending the profile details as well as opportunitie details
        ctx.send({
          data: {
            profile_photo: exists.profile_photo.url,
            first_name: exists.first_name,
            last_name: exists.last_name,
            bio: exists.bio,
            about_me: exists.about_me,
            opportunities: opportunities,
          },
        });
      }
      //if user dosent exist send message and code 2
      else if (!exists) {
        ctx.send({
          message: "profile not found",
          code: 2
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
