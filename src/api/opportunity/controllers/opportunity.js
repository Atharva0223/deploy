"use strict";

/**
 * opportunity controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::opportunity.opportunity",
  ({ strapi }) => ({
    async create(ctx) {
      let result = await strapi.service("api::opportunity.opportunity").create({
        ...ctx.request.body.data,
        // owner: ctx.state.user.id,  
      });

      // Send notification to all users
      const devices = await strapi.query("device-info").find();
      for (const device of devices) {
        if (device.token) {
          strapi.notification.sendNotification(device.token, {
            notification: {
              title: "New Opportunity Created",
              body: "A new opportunity has been created!",
            },
          });
        }
      }
      

      ctx.body = result;
    },
  })
);
