const { client } = require("../../../../config/pg");

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
      COALESCE(opp.start_on) AS "Start Date",
      COALESCE(opp.end_on) AS "End Date",
      COALESCE(ROUND(AVG(r.value), 1), 0) AS "Rating"
      FROM 
      saves s
      LEFT JOIN opportunities opp ON s.opportunity = opp.id
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
      s.save = true AND s.opportunity = $1 AND s.users = $2
      GROUP BY
      s.users,
      s.save,
      s.opportunity,
      org_logo.url,
      org.name,
      opp.profile,
      opp.city,
      opp_image.url,
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
      //check if saved opportunity exists?
      const query = `
      SELECT s.id,s.save
      FROM saves s
      WHERE s.opportunity = $1 AND s.users = $2
    `;
      //                                            opportunity id  user id
      const data = await client.query(query, [ctx.params.id1, ctx.params.id2]);
      
      console.log(!data.rows.length);

      // ifsaved opportunity exists then delete
      if(!data.rows.length==false){
        const query = `
        DELETE FROM saves s
        WHERE s.opportunity = $1 AND s.users = $2
      `;
        //                                            opportunity id  user id
        const data = await client.query(query, [ctx.params.id1, ctx.params.id2]);

        ctx.send({
          message: "Opportunity unsaved"
        })
      }
      //else if saved opportunity dosent exists then send message already deleted
      else if(!data.rows.length==true){
        ctx.send({
          message: "Opportunity already unsaved"
        })
      }
    } catch (error) {
      console.log(error);
    }
  },

  //This will save a post
  async save(ctx) {
    try {
      const query = `
      SELECT s.id, s.save
      FROM saves s
      WHERE s.opportunity = $1 AND s.users = $2
      ORDER BY s.id DESC
    `;
      //                                            opportunity id  user id
      const data = await client.query(query, [ctx.params.id1, ctx.params.id2]);

      if(!data.rows.length==false){
        ctx.send({
          message: "Opportunity is already saved"
        })
      }
      else if(!data.rows.length==true){
        
        const query = `
        INSERT INTO saves (save,opportunity,users,created_at,updated_at) VALUES (true,$1,$2,now(),now())
        `
        const data = await client.query(query, [ctx.params.id1, ctx.params.id2]);

        ctx.send({
          message: "Opportunity saved"
        })
      }
    } catch (error) {
      console.log(error);
    }
  },

};
