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
      {
        method: "DELETE",
        path: "/unfollowPerson/:id1/:id2",
        handler: "followers.unfollowPerson",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "DELETE",
        path: "/unfollowOrganization/:id1/:id2",
        handler: "followers.unfollowOrganization",
        config: {
          policies: [],
          middleware: [],
        },
      },
      {
        method: "POST",
        path: "/follow",
        handler: "followers.follow",
        config: {
          policies: [],
          middleware: [],
        },
      },
    ]
};