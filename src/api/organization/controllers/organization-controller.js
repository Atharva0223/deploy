const {client} = require("../../../../config/pg");

module.exports = {
    //fetching all the posts
    async delete(ctx) {
      try {
        const query = `
        SELECT 
        org_logo.url AS "Organization logo",
        org.name AS "Organization name",
        opp.profile AS "Opportunity profile",
        opp.city AS "City",
        opp_image.url AS "Opportunity image",
        opp.months AS "Duration",
        ROUND(AVG(r.value), 1) AS "Rating"
      FROM 
        opportunities opp
        JOIN opportunities_organization_links ool ON opp.id = ool.opportunity_id
        JOIN organizations org ON ool.organization_id = org.id
        JOIN opportunities_organization_user_links ooul ON opp.id = ooul.opportunity_id
        JOIN ratings_opportunity_links rol ON rol.opportunity_id = opp.id
        JOIN ratings r ON r.id = rol.rating_id
        JOIN files_related_morphs frm_logo ON frm_logo.related_id = opp.id AND frm_logo.field = 'logo'
        JOIN files org_logo ON frm_logo.file_id = org_logo.id
        JOIN files_related_morphs frm_image ON frm_image.related_id = opp.id AND frm_image.field = 'image'
        JOIN files opp_image ON frm_image.file_id = opp_image.id
      WHERE
        opp.is_deleted = false
      GROUP BY 
        org_logo.url,
        opp.months,
        org.name,
        opp.profile,
        opp.city,
        opp_image.url;
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