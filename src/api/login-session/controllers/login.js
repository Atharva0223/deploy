const {sendSMS, sendEmail} = require("../../../otp-send");

module.exports = {
  async sendOTP(ctx) {
    try {
      //get either the phone or email or both from the body
      const { phone, email } = ctx.request.body;

      if(!phone && !email){
        ctx.send({
          message: "Please enter a phone number or email address",
          code: 2
        })
      }
      // generate an otp here
      var val = Math.floor(1000 + Math.random() * 9000);

      //if email and phone are received
      if (email && phone) {
        //check if a user exists with that email AND phone
        const exists = await strapi
          .query("plugin::users-permissions.user")
          .findOne({
            where: {
              $and: [{ phone }, { email }],
            },
          });

          //if exists then send otp to mail and phone
          if(exists){
            //call the service to send email and sms
            const smsResponse = await sendSMS(phone, val);
            const mailResponse = await sendEmail(email, val);
            ctx.send({
              message: "OTP sent successfully",
              code: 1,
              mailResponse: mailResponse,
              smsResponse: smsResponse
            })
          }
          //if not exists then send error with code 2
          else if(!exists){
            //send error saying user dosent exists
            ctx.send({
              message: "User dosent exists",
              code: 2
            })
          }
      }
      // if email or phone is received
      else if (email || phone) {
        const exists = await strapi
          .query("plugin::users-permissions.user")
          .findOne({
            where: {
              $or: [{ phone }, { email }],
            },
          });

          if(phone){
            const smsResponse = await sendSMS(phone, val);
            ctx.send({
              message: "OTP sent successfully",
              code: 1,
              smsResponse: smsResponse
            })
          }
          else if(email){
            const mailResponse = await sendEmail(email, val);
            ctx.send({
              message: "OTP sent successfully",
              code: 1,
              mailResponse: mailResponse
            })
          }
          else{
            ctx.send({
              message: "An error occurred while sending otp",
              code: 2
            })
          }
      }
    } catch (error) {
      ctx.send({
        data: {
          message: "An error occurred while sending otp",
          code: 2,
        },
      });
    }
  },

  async verifyOTP(ctx) {
    try {
      const { phone, email, otp } = ctx.request.body;

      // check if the user exists for that email or phone number
      const exists = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            $or: [{ phone }, { email }],
            $and: [{ otp }],
          },
        });

      //check if login of that user exists
      const login = await strapi
        .query("api::login-session.login-session")
        .findOne({ where: { users: exists.id } });

      //issuing a JWT token to the id
      const jwtToken = strapi.plugins["users-permissions"].services.jwt.issue({
        id: exists.id,
      });

      //if user exists then update or create the login-session collection type
      if (exists) {
        // if user has already logged in
        if (login) {
          const update = await strapi
            .query("api::login-session.login-session")
            .update({
              where: {
                users: exists.id,
              },
              data: {
                jwt_token: jwtToken,
                device_id: ctx.request.body.device_id,
                status: 1,
              },
            });
          // resturn login successful
          ctx.send({
            data: {
              message: "Login Successful",
              code: 1,
              jwt: jwtToken,
              id: exists.id,
              first_name: exists.first_name,
              last_name: exists.last_name,
              email: exists.email,
            },
          });
        }
        // if user is logging in for the first time
        else if (!login) {
          const create = await strapi
            .query("api::login-session.login-session")
            .create({
              data: {
                users: exists.id,
                jwt_token: jwtToken,
                device_id: ctx.request.body.device_id,
                status: 1,
              },
            });
        }
        // Return the JWT token in the response body
        ctx.send = {
          data: {
            message: "Login Successful",
            code: 1,
            jwt: jwtToken,
            id: exists.id,
            first_name: exists.first_name,
            last_name: exists.last_name,
            email: exists.email,
          },
        };
      }
      //if not exists then send error message invalid otp
      else if (!exists) {
        ctx.send({
          data: {
            message: "Invalid OTP",
            code: 2,
          },
        });
      }
    } catch (error) {
      ctx.send({
        data: {
          message: "Invalid OTP",
          code: 2,
        },
      });
    }
  },
};
