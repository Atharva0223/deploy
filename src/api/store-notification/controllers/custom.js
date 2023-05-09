const { client } = require("../../../../config/pg");

module.exports = {
  //deleting an opportunity
  async read(ctx) {
    try {
      const ids = ctx.params.id;
      const isread = await strapi.query('api::store-notification.store-notification').update({
        where: {
            nid: ids
        },
        data: {
            isRead: true
        }
    })
    ctx.send({
        isread: isread
      })
    } catch (error) {
      console.log(error);
    }
  },
};
