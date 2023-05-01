const { client } = require("../../../../config/pg");

module.exports = {
  //splashscreen
  //This will fetch all the new opportunities on splash screen (top 5)
  async findTopFive(ctx) {
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
      TO_CHAR(COALESCE(opp.start_on),'DD Mon YYYY') AS "Start Date",
      TO_CHAR(COALESCE(opp.end_on),'DD Mon YYYY') AS "End Date",
      TO_CHAR(AGE(opp.end_on, opp.start_on), 'YY "years" MM "months"') AS "Duration",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating",
      os.status AS "Opportunity Status",
      os.approved AS "Approval status",
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
      LEFT JOIN saves s ON opp.id = s.opportunity
      LEFT JOIN opportunity_statuses os ON opp.id = os.opportunity
      WHERE
      opp.is_deleted = false AND os.user = $1
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
      LIMIT
      5
    `;

      const data = await client.query(query, [ctx.params.id]);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //This will fetch all the ongoing and waiting opportunities on splash screen (top 5)
  async findTopFiveOngoing(ctx) {
    try {
      const query = `
      SELECT
      opp.id AS "Opportunity ID",
      org.id AS "Organization ID",
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      os.status AS "Opportunity Status",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp.city, '') AS "City",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      org.website AS "Website",
      TO_CHAR(AGE(opp.end_on, opp.start_on), 'YY "years" MM "months"') AS "Duration",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating",
      os.status AS "Opportunity Status",
      os.approved AS "Approval status",
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
      LEFT JOIN opportunity_statuses os ON opp.id = os.opportunity
      LEFT JOIN up_users uu ON uu.id = os.user
      LEFT JOIN saves s ON opp.id = s.opportunity
      WHERE
      uu.id = $1 AND os.status = 'ongoing' AND opp.is_deleted = false
      GROUP BY
      opp.id,
      org.id,
      org_logo.url,
      os.status,
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
      LIMIT
      5
    `;

      const data = await client.query(query, [ctx.params.id]);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  //This will fetch all the completed opportunities on splash screen (top 5)
  async findTopFiveCompleted(ctx) {
    try {
      const query = `
      SELECT
      opp.id AS "Opportunity ID",
      org.id AS "Organization ID",
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      os.status AS "Opportunity Status",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp.city, '') AS "City",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      org.website AS "Website",
      TO_CHAR(AGE(opp.end_on, opp.start_on), 'YY "years" MM "months"') AS "Duration",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating",
      os.status AS "Opportunity Status",
      os.approved AS "Approval status",
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
      LEFT JOIN opportunity_statuses os ON opp.id = os.opportunity
      LEFT JOIN up_users uu ON uu.id = os.user
      LEFT JOIN saves s ON opp.id = s.opportunity
      WHERE
      uu.id = $1 AND os.status = 'completed' AND opp.is_deleted = false
      GROUP BY
      opp.id,
      org.id,
      org_logo.url,
      os.status,
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
      LIMIT
      5
    `;

      const data = await client.query(query, [ctx.params.id]);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
