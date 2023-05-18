const { generateRandomString } = require("../../../random-password");
const bcrypt = require("bcryptjs");
const {sendEmail} = require("../../../otp-send");

module.exports = {
  async register(ctx) {
    try {
      
      //Fetch first_name, last_name, phone, email from ctx.request.body
      const { first_name, last_name, phone, email } = ctx.request.body;

      // check if the user exists with that email or phone number
      const exists = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            $or: [{ phone: phone }, { email: email }],
          },
        });

      //auto generate a unique username and password
      var val = Math.floor(10000 + Math.random() * 90000);
      var otp = Math.floor(1000 + Math.random() * 9000);

      //generate a password for the user using the random-password service
      const password = await generateRandomString(10);

      // Hash the password with bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // validatePassword the password
      // const validatePassword = (password, hash) => bcrypt.compare(password, hash);

      //if the user dosent exist then register the user
      if (!exists) {
        const insert = await strapi
          .query("plugin::users-permissions.user")
          .create({
            data: {
              username: val,
              password: hashedPassword,
              first_name: first_name,
              last_name: last_name,
              phone: phone,
              email: email,
              confirmed: true,
              role: 1,
              otp: otp
            },
          });

          const mailResponse = await sendEmail(email,otp)
        // send response to let the user know that they have been registered
        ctx.send({
          data: {
            message: "Congratulations, you have successfully registered",
            code: 1,
            first_name: insert.first_name,
            last_name: insert.last_name,
            phone: insert.phone,
            email: insert.email,
            mailResponse: mailResponse
          },
        });
      }
      // if the user exists then send message "Phone or Email is user already registered"
      else if (exists) {
        // Return message Already registerd
        ctx.send({
          data:{
            message: "You have already registered",
            code: 2
          }
        });
      }
    } catch (error) {
      ctx.send({
        data: {
          message: "An error occurred",
          code: 2,
          error: error,

        }
      });
    }
  },
};
