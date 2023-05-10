const { client } = require("../../../../config/pg");

module.exports = {
  //deleting an opportunity
  async read(ctx) {
    try {
      const ids = ctx.params.id;
      const isread = await strapi
        .query("api::store-notification.store-notification")
        .update({
          where: {
            nid: ids,
          },
          data: {
            isRead: true,
          },
        });
      ctx.send({
        isread: isread,
      });
    } catch (error) {
      console.log(error);
    }
  },

  async findNotifications(ctx) {
    try {
      const notifications = await strapi
        .query("api::store-notification.store-notification")
        .findMany();

        const data = [];

      for (let i = 0; i < notifications.length; i++) {
        //store all the createdAt in dateTimeString
        const dateTimeString = notifications[i].createdAt;

        const dateObj = new Date(dateTimeString);

        const timeDiffMs = new Date() - dateObj;

        const postedAtSec = Math.floor(timeDiffMs / 1000);
        const postedAtMin = Math.floor(timeDiffMs / 60000);
        const postedAtHrs = Math.floor(timeDiffMs / 3600000);

        const store = {
            id: notifications[i].id,
            title: notifications[i].title,
            type: notifications[i].type,
            image: notifications[i].image,
            nid: notifications[i].nid,
            isRead: notifications[i].isRead,
            postedAtSec: postedAtSec,
            postedAtMin: postedAtMin,
            postedAtHrs: postedAtHrs,
          }
          data.push(store);
      };
      ctx.send({
        data
      })
    } catch (error) {
      ctx.send(error);
    }
  },
};
