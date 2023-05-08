module.exports = {
    routes: [
      //read A notification
      {
        method: "POST",
        path: "/notificationRead/:id",
        handler: "custom.read",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ],
  };