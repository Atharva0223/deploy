module.exports = {
    routes: [
//apply Opportunity
      {
        method: "POST",
        path: "/sendOTP",
        handler: "login.sendOTP",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "POST",
        path: "/verifyOTP",
        handler: "login.verifyOTP",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
};