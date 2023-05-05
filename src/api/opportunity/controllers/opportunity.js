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

        await sendNotification(data);

      ctx.body = result;
    },
  })
);
