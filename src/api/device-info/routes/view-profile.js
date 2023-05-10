module.exports = {
    routes: [
      {
        method: "GET",
        path: "/profile/:id",
        handler: "view-profile.viewProfile",
        config: {
          policies: [],
          middleware: []
        },
      },
    ],
  };
  