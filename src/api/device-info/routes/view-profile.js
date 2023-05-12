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
      {
        method: "PUT",
        path: "/editProfile/:id",
        handler: "view-profile.editProfile",
        config: {
          policies: [],
          middleware: []
        },
      },
    ],
  };
  