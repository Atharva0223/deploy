const {client} = require("../../../../config/pg");

module.exports = {
  //This will fetch all the saved opportunities of a user
  async saved(ctx) {
    try {
      const query = `
      SELECT
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp.city, '') AS "City",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      COALESCE(opp.months) AS "Duration",
      COALESCE(opp.start_on) AS "Start Date",
      COALESCE(opp.end_on) AS "End Date",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating"
      FROM 
      saves s
      LEFT JOIN saves_opportunity_links sol ON s.id = sol.save_id
      LEFT JOIN saves_user_links sul ON sul.save_id = s.id
      LEFT JOIN opportunities opp ON sol.opportunity_id = opp.id
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN ratings_opportunity_links rol ON rol.opportunity_id = opp.id
      LEFT JOIN ratings r ON r.id = rol.rating_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      WHERE
      s.save = true AND sul.user_id = $1
      GROUP BY
      sul.user_id,
      s.save,
      sol.opportunity_id,
      org_logo.url,
      org.name,
      opp.profile,
      opp.city,
      opp_image.url,
      opp.months,
      opp.start_on,
      opp.end_on
    `;

      const data = await client.query(query, [ctx.params.id]);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //This will unsave a post
  async unsave(ctx) {
    try {
      const query = `
      Delete from saves where id = (
      SELECT
      s.id
      FROM saves s
      LEFT JOIN saves_opportunity_links sol ON s.id = sol.save_id
      LEFT JOIN saves_user_links sul ON s.id = sul.save_id
      WHERE sol.opportunity_id = $1 AND sul.user_id = $2)
    `;

      const data = await client.query(query, [ctx.params.id1,ctx.params.id2]);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

};
