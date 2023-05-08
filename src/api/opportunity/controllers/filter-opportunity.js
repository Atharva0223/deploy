const { client } = require("../../../../config/pg");

module.exports = {
  //deleting an opportunity
  async getFiltersOpportunities(ctx) {
    try {
      const query = `
      SELECT 
      opp.id AS "Opportunity ID",
      org.id AS "Organization ID",
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp.city, '') AS "City",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      org.website AS "Website",
      TO_CHAR(AGE(opp.end_on, opp.start_on), 'YY "years" MM "months"') AS "Duration",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating",
      os.approved AS "Approval status",
      os.status AS "Opportunity Status",
      s.save AS "Save Status"
      FROM 
      opportunities opp
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN ratings_opportunity_links rol ON rol.opportunity_id = opp.id
      LEFT JOIN ratings r ON r.id = rol.rating_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      LEFT JOIN opportunity_statuses os ON os.opportunity = opp.id
      LEFT JOIN saves s ON s.opportunity = opp.id
      WHERE
      opp.is_deleted = false
      GROUP BY
      opp.id,
      org.id,
      org_logo.url,
      org.website,
      org.name,
      opp.profile,
      opp.city,
      opp_image.url,
      os.status,
      os.approved,
      s.save,
      opp.created_at
      ORDER BY
      opp.created_at DESC
    `;

      const data = await client.query(query);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
