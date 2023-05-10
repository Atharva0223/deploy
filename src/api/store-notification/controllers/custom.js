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
      const data = await strapi
        .query("api::store-notification.store-notification")
        .findMany();

      for (let i = 0; i < data.length; i++) {
        //store all the createdAt in dateTimeString
        const dateTimeString = data[i].createdAt;

        const dateObj = new Date(dateTimeString);

        const timeDiffMs = new Date() - dateObj;

        const timeDiffSec = Math.floor(timeDiffMs / 1000);
        const timeDiffMin = Math.floor(timeDiffMs / 60000);
        const timeDiffHrs = Math.floor(timeDiffMs / 3600000);

        ctx.send({
          data:{
            id: data[i].id,
            title: data[i].title,
            type: data[i].type,
            image: data[i].image,
            nid: data[i].nid,
            isRead: data[i].isRead,
            timeDiffSec: timeDiffSec,
            timeDiffMin: timeDiffMin,
            timeDiffHrs: timeDiffHrs
          }
        })
      }
    } catch (error) {
      ctx.send(error);
    }
  },
};
