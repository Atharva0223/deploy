module.exports = {
    routes: [
      {
        method: "POST",
        path: "/volunteer-register",
        handler: "volunteer.register",
        config: {
          policies: [],
          middleware: []
        },
      },
    ],
  };
  