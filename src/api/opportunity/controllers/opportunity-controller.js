const {client} = require("../../../../config/pg");

module.exports = {
  //dashboard
  //NEW OPPORTUNITIES
  //This will fetch all the new opportunities on dashboard
  async find(ctx) {
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
        AGE(opp.end_on, opp.start_on) AS "Duration",
        COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating",
        sul.user_id AS "User ID",
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
        LEFT JOIN saves_opportunity_links sol ON sol.opportunity_id = opp.id
        LEFT JOIN saves s ON sol.save_id = s.id
        LEFT JOIN saves_user_links sul ON sul.save_id = s.id
        WHERE
        opp.is_deleted = false
        GROUP BY
        sul.user_id,
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
      CASE WHEN f.user = $2 AND f.organization = org.id THEN true ELSE false END AS "Following"
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
      f.organization,
      f.user,
      opp.id,
      org.id,
      org_logo.url,
      org.name,
      opp.profile,
      opp_image.url,
      opp.responsibilities,
      opp.skills,
      opp.created_at
      ORDER BY
      opp.created_at DESC;
    `;
      //                                      opp.id          user.id
      const data = await client.query(query, [ctx.params.id1,ctx.params.id2]);

      ctx.send({
        data: data.rows,
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

  //ONGOING AND WAITING TASKS
  //View all ongoing and waiting opportunities
  async viewOngoing(ctx) {
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
      AGE(opp.end_on,opp.start_on) AS "Duration",
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
      LEFT JOIN saves_opportunity_links sol ON sol.opportunity_id = opp.id
      LEFT JOIN saves s ON sol.save_id = s.id
      LEFT JOIN saves_user_links sul ON sul.save_id = s.id
      WHERE
      uu.id=$1 AND os.status='ongoing' AND opp.is_deleted=false
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

  //View all completed opportunities
  async viewCompleted(ctx) {
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
      AGE(opp.end_on,opp.start_on) AS "Duration",
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
      LEFT JOIN saves_opportunity_links sol ON sol.opportunity_id = opp.id
      LEFT JOIN saves s ON sol.save_id = s.id
      LEFT JOIN saves_user_links sul ON sul.save_id = s.id
      WHERE
      uu.id = $1 AND os.status='completed' AND opp.is_deleted = false
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
      AGE(opp.end_on,opp.start_on) AS "Dration",
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
      LEFT JOIN saves_opportunity_links sol ON sol.opportunity_id = opp.id
      LEFT JOIN saves s ON sol.save_id = s.id
      LEFT JOIN saves_user_links sul ON sul.save_id = s.id
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

      const data = await client.query(query,[ctx.params.id]);
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
      AGE(opp.end_on,opp.start_on) AS "Duration",
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
      LEFT JOIN saves_opportunity_links sol ON sol.opportunity_id = opp.id
      LEFT JOIN saves s ON sol.save_id = s.id
      LEFT JOIN saves_user_links sul ON sul.save_id = s.id
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

      const data = await client.query(query,[ctx.params.id]);
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
	  AGE(opp.end_on,opp.start_on) AS "Duration",
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
      LEFT JOIN saves_opportunity_links sol ON sol.opportunity_id = opp.id
      LEFT JOIN saves s ON sol.save_id = s.id
      LEFT JOIN saves_user_links sul ON sul.save_id = s.id
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

      const data = await client.query(query,[ctx.params.id]);
      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },
  
  //deleting an opportunity
  async delete(ctx) {
    try {
      const query = `
      UPDATE
        opportunities
      SET
        is_deleted = true
      Where
        id = $1`;

      const data = await client.query(query, [ctx.params.id]);
      ctx.send("Record deleted sucessfully");
    } catch (error) {
      console.log(error);
    }
  },
};
