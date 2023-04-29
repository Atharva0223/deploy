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
      {
        method: "POST",
        path: "/followPerson",
        handler: "followers.followPerson",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "POST",
        path: "/followOrganization",
        handler: "followers.followOrganization",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
};