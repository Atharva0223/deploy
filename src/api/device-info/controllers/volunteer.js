const { generateRandomString } = require("../../../random-password");
const bcrypt = require("bcryptjs");

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
              first_name,
              last_name,
              phone,
              email,
              confirmed: true,
              role: 1,
            },
          });
        // send response to let the user know that they have been registered
        ctx.send({
          message: "Congratulations, you have successfully registered",
          data: {
            first_name: insert.first_name,
            last_name: insert.last_name,
            phone: insert.phone,
            email: insert.email,
          },
        });
      }
      // if the user exists then send message "Phone or Email is user already registered"
      else if (exists) {
        // Return message Already registerd
        ctx.send({
          message: "You have already registered",
        });
      }
    } catch (error) {
      ctx.send(error);
    }
  },
};