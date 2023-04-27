const {client} = require("../../../../config/pg");

module.exports = {
    //dashboard
    //NEW OPPORTUNITIES
    //This will fetch all the new opportunities on dashboard
    async notificationFind(ctx) {
      try {
        
        const query = `
        SELECT
        f.url,
        dn.name,
        dn.bio,
        dn.message
        FROM
        dummy_notifications dn
        LEFT JOIN files_related_morphs frm ON dn.id = frm.related_id AND frm.field = 'notification_image'
        LEFT JOIN files f ON f.id = frm.file_id
        GROUP BY
        f.url,
        dn.name,
        dn.bio,
        dn.message
        `;
        const data = await client.query(query);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },
}