const sgMail = require("@sendgrid/mail");

// fetch sendgrid credentials
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_Email_Id = process.env.SENDGRID_Email_Id;

//set API key for sendgrid
sgMail.setApiKey(SENDGRID_API_KEY);

// fetch twilio credentials

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const fromPhone = process.env.fromPhone;

module.exports = {
  async sendOTP(ctx) {
    try {
      //get either the phone or email from the body
      const { phone, email } = ctx.request.body;
      console.log("phone", phone, "email", email);

      // generate an otp here
      var val = Math.floor(1000 + Math.random() * 9000);

      //check if we have received email or phone
      const where = {};
      if (phone) {
        where.phone = phone;
      } else if (email) {
        where.email = email;
      }

      // check if the user exists for that email or phone number
      const exists = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where });

      // if the user exists then check if we have received the email or phone number and send otp for the same
      if (exists) {
        //add the otp to users collection type to that user
        const setOTP = await strapi
          .query("plugin::users-permissions.user")
          .update({
            where,
            data: {
              otp: val,
            },
          });

        // if user exists and we have received the email then send otp on mail
        if (email) {
          //send the otp to that email
          //mail body
          const msg = {
            to: email, // Change to your recipient
            from: SENDGRID_Email_Id, // Change to your verified sender
            subject: "VishwaMitra Login OTP",
            text: `Here is you otp for login ${val}`,
            // html: "<strong>and easy to do anywhere, even with Node.js</strong>",
          };

          //send mail
          sgMail.send(msg).catch((error) => {
            ctx.send({
              data: {
                error: error,
                code: 2,
              },
            });
          });

          // Return message otp sent successfully
          ctx.send({
            data: {
              message: "OTP sent successfully",
              code: 1,
            },
          });
        }
        //------------------------------------------------------------------------------------------------------------------------
        // if received phone
        if (phone) {
          //send the otp to tht phone number
          const client = require("twilio")(accountSid, authToken);
          client.messages.create({
            body: `Hello, here is your otp ${val}`,
            from: `${fromPhone}`,
            to: `+91${ctx.request.body.phone}`,
          });

          // Return message otp sent successfully
          ctx.send({
            data: {
              message: "OTP sent sucessfully",
              code: 1,
            },
          });
        }
      }
      // if user not found send error message user not found
      else if (!exists) {
        ctx.send({
          data: {
            message: "User not found",
            code: 2,
          },
        });
      }
    } catch (error) {
      ctx.send({
        data: {
          message: error,
          code: 2,
        },
      });
    }
  },

  async verifyOTP(ctx) {
    try {
      const { phone, email } = ctx.request.body;

      //check if we have received email or phone
      const where = {};
      if (phone) {
        where.phone = phone;
      } else if (email) {
        where.email = email;
      }

      // check if the user exists for that email or phone number
      const exists = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where });

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
            console.log(update);
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
          message: "error",
          code: 2,
        },
      });
    }
  },
};
