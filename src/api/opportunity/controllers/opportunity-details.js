const {client} = require("../../../../config/pg");

module.exports = {
  //fetching responsibilities and skills of an individual opportunity
  async findOpportunity(ctx) {
    try {
      const query = `
      SELECT
      opp.id AS "Opportunity ID",
      org.id AS "Organization ID",
      org_logo.url AS "Organization logo",
      COALESCE(org.name, '') AS "Organization name",
      COALESCE(opp.profile, '') AS "Opportunity profile",
      COALESCE(opp_image.url, '') AS "Opportunity image",
      COALESCE(opp.responsibilities, '') AS "Responsibilities",
      COALESCE(opp.skills, '') AS "Skills",
      opp.start_on AS "Start On",
      opp.end_on AS "End On",
      CASE WHEN f.users = $2 AND f.organization = org.id THEN true ELSE false END AS "Following"
      FROM 
      opportunities opp
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      LEFT JOIN opportunities_tags_links otl ON otl.opportunity_id = opp.id
      LEFT JOIN followings f ON f.organization = org.id
      WHERE
      opp.id = $1 AND opp.is_deleted = false
      GROUP BY
      opp.id,
      org.id,
      org_logo.url,
      opp_image.url,
      f.users,
      f.organization
      ORDER BY
      opp.created_at DESC;
      `
      //                                      opp.id          user.id
      const data = await client.query(query, [ctx.params.id1,ctx.params.id2]);

      const rating = await strapi.query('api::rating.rating').findOne({
        where: {
          opportunity: ctx.params.id1,
          users: ctx.params.id2
        }
      })
      
      console.log(rating);
      ctx.send({
        data: data.rows,
        rating: rating.value
      });
    } catch (error) {
      console.log(error);
    }
  },

  //displaying facilities, terms and support of an individual opportunity
  async findOpportunityDetails(ctx) {
    try {
      const query = `
      SELECT
      opp.id AS "Opportunity ID",
      org.id AS "Organization ID",
      opp.start_on AS "Start On",
      opp.end_on AS "End On",
      opp_image.url AS "Opportunity image",
      org.name AS "Organization name",
      opp.profile AS "Opportunity profile",
      opp.facilities AS "Facilities provided",
      opp.support AS "Support provided",
      opp.terms AS "Terms and Conditions"
      FROM 
      opportunities opp
      LEFT JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
      LEFT JOIN organizations org ON ool.organization_id = org.id
      LEFT JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
      LEFT JOIN files_related_morphs frm_logo ON frm_logo.related_id = ool.organization_id AND frm_logo.field = 'logo'
      LEFT JOIN files org_logo ON frm_logo.file_id = org_logo.id
      LEFT JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
      LEFT JOIN files opp_image ON frm_image.file_id = opp_image.id
      WHERE
      opp.id = $1 AND opp.is_deleted = false
      GROUP BY
      opp.id,
      org.id,
      opp_image.url,
      org.name,
      opp.profile,
      opp.facilities,
      opp.support,
      opp.terms,
      opp.created_at
      ORDER BY
      opp.created_at DESC;
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
