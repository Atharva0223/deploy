"use strict";

// const { client } = require("../../../../config/pg");
// const fetch = require("node-fetch");
// const FCM_API_KEY = process.env.FCM_API_KEY;
const { sendNotification } = require("../../../notification_service");

/**
 * opportunity controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::opportunity.opportunity",
  ({ strapi }) => ({
    async create(ctx) {
      const { data } = ctx.request.body;
      if (!data || typeof data !== "object") {
        return ctx.throw(400, "Invalid payload submitted");
      }

      let result = await strapi
        .service("api::opportunity.opportunity")
        .create({ data });

      //Send notification
      //get org image
      const orgDetails = await strapi
        .query("api::organization.organization")
        .findOne({
          where: {
            id: data.organization,
          },
          populate: { logo: true },
        });
      //get opp id
      const oppId = await strapi.entityService.findMany(
        "api::opportunity.opportunity",
        {
          limit: 1,
          sort: { id: "DESC" },
        }
      );

      const notification = {
        image: orgDetails.logo.url,
        title: orgDetails.name + " created opportunity " + data.profile,
        body: "This opportunity is available in " + data.city,
        data: {
          nid: oppId[0].id,
          type: "new_opportunity_posted"
        },
      };
      await sendNotification(notification);
      ctx.body = result;
    },
  })
);
