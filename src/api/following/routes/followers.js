module.exports = {
    routes: [
//apply Opportunity
      {
        method: "GET",
        path: "/getFollowers/:id",
        handler: "followers.getFollowers",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
};