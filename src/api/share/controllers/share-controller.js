const {client} = require("../../../../config/pg");

module.exports = {
  //dashboard
  //This will update the count of shares by user
  async share(ctx) {
    try {
      const query = `
      UPDATE shares
      SET count = count + 1
      FROM shares_user_links
      WHERE shares.id = shares_user_links.share_id
      AND user_id = $1;
    `;

      const data = await client.query(query,[ctx.params.id]);
      ctx.send("post shared");
    } catch (error) {
      console.log(error);
    }
  },
};