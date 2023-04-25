const { connect } = require("../../../../config/pg");

module.exports = {
//Here the user will be able to seeall the applied opportunities
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
}