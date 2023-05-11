const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

// Twilio Credentials
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const fromPhone = process.env.fromPhone;
const client = new twilio(accountSid, authToken);

// SendGrid Credentials
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_Email_Id = process.env.SENDGRID_Email_Id;
sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = {
  sendSMS: async (phone, val) => {
    try {
      client.messages.create({
        body: `Hello, here is you otp ${val}`,
        to: `+91${phone}`,  
        from: fromPhone
      });
      return "OTP sent to phone successfully";
    } catch (error) {
      ctx.throw(400, error);
    }
  },

  sendEmail: async (email, val) => {
    try {
      const msg = {
        to: email,
        from: SENDGRID_Email_Id,
        subject: `Welcome to VishwaMitra`,
        text: `Hello, here is you otp ${val}`,
      };
      await sgMail.send(msg);
      return "OTP sent to mail successfully";
    } catch (error) {
      ctx.throw(400, error);
    }
  },
};
