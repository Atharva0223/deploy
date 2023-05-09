module.exports = {
    async sendOTP(ctx) {
      try {
        const exists = await strapi
          .query("plugin::users-permissions.user")
          .findMany({
            where: {
              phone: ctx.request.body.phone,
            },
          });
  
        if (exists.length > 0) {
          var val = Math.floor(1000 + Math.random() * 9000);
          const setOTP = await strapi
            .query("plugin::users-permissions.user")
            .update({
              where: {
                phone: ctx.request.body.phone,
              },
              data: {
                otp: val,
              },
            });
          const accountSid = process.env.accountSid;
          const authToken = process.env.authToken;
          const client = require("twilio")(accountSid, authToken);
          client.messages
            .create({
              body: `Hello, here is your otp ${val}`,
              from: "+12545665776",
              to: `+91${ctx.request.body.phone}`,
            })
            .then((message) => console.log(message.sid));
          ctx.send({
            message: "otp sent sucessfully",
          });
        } else if (exists.length <= 0) {
          ctx.send({
            message: "User not found",
          });
        }
  
        //
      } catch (error) {
        console.error(error);
      }
    },
  
    async verifyOTP(ctx) {
      try {
        const exists = await strapi
          .query("plugin::users-permissions.user")
          .findOne({
            where: {
              phone: ctx.request.body.phone,
              otp: ctx.request.body.otp,
            },
          });
        if (!exists) {
          ctx.throw(401, "Invalid OTP");
        }
        const jwtToken = strapi.plugins["users-permissions"].services.jwt.issue({
          id: exists.id,
        });
        // Return the JWT token in the response body
        ctx.body = {
          jwt: jwtToken,
          data: {
            id: exists.id,
            first_name: exists.first_name,
            last_name: exists.last_name,
            email: exists.email,
          },
        };
      } catch (error) {
        console.log(error);
      }
    },
  };
  