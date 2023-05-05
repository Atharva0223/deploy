const { client } = require("../config/pg");
const fetch = require("node-fetch");
const FCM_API_KEY = process.env.FCM_API_KEY;
const fcmEndpoint = process.env.fcmEndpoint; //fcm api endpoint

module.exports = {
  sendNotification: async (data) => {
    // Send notification to all users
    const dtoken = `SELECT token FROM device_infos;`; //get all tokens
    const getToken = await client.query(dtoken); //store them in getToken

    const notifications = getToken.rows
      .filter((row) => row.token)
      .map((row) => ({
        notification: {
          title: `New opportunity posted "${data.profile}"`,
          body: `Opportunity type "${data.opportunity_type}" and this opportunity is in "${data.city}"`,
          android_channel_id: "Vishvmitraapp",
        },
        to: row.token,
      }));

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${FCM_API_KEY}`,
      },
    };

    const promises = notifications.map((notification) =>
      fetch(fcmEndpoint, {
        ...requestOptions,
        body: JSON.stringify(notification),
      }).then((response) => {
        if (response.ok) {
          console.log("Notification sent successfully");
        } else {
          console.error(
            "Failed to send notification:",
            response.statusText
          );
        }
      })
    );

    await Promise.all(promises);
  },
};
