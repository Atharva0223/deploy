const { client } = require("../../../../config/pg");

module.exports = {
  //Here the user will be able to see all the applied opportunities
  async getApply(ctx) {
    try {
      const query = `
      SELECT
      os.user AS "User",
      os.opportunity AS "Opportunity",
      os.status AS "Status",
      os.approved AS "Approved"
      FROM opportunity_statuses os
      WHERE os.user = $1;
    `;

      const data = await client.query(query, [ctx.params.id]);

      ctx.send({
        data: data.rows,
      });
    } catch (error) {
      console.log(error);
    }
  },

  async unapply(ctx) {
    try {
      const exists = await strapi.query('api::opportunity-status.opportunity-status').findOne({
        where: {
          opportunity: ctx.params.oid,
          user: ctx.params.uid
        }
      });
      console.log(exists);
      if(exists){
        const del = await strapi.query('api::opportunity-status.opportunity-status').delete({
          where: {
            opportunity: ctx.params.oid,
            user: ctx.params.uid
          }
        });
        ctx.send({
          message: "You have cancelled the application",
          code: 1,
        })
      } else if(!exists){
        ctx.send({
          message: "ERROR! You have either cancelled the application alrady or not applied yet",
          code: 2,
        })
      }

      

      
    } catch (error) {
      console.log(error);
    }
  },
};
