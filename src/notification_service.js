const { client } = require("../config/pg");
const fetch = require("node-fetch");
const FCM_API_KEY = process.env.FCM_API_KEY;
const fcmEndpoint = process.env.fcmEndpoint; //fcm api endpoint

module.exports = {
  sendNotification: async (notification) => {
    // Send notification to all users
    const dtoken = `SELECT token FROM device_infos;`; //get all tokens
    const getToken = await client.query(dtoken); //store them in getToken

    const notifications = getToken.rows
      .filter((row) => row.token)
      .map((row) => ({
        notification: {
          image: notification.image,
          title: notification.title,
          body: notification.body,
          android_channel_id: "Vishvmitraapp",
          data: notification.data
        },
        to: row.token,
      }));

      const enter =  await strapi.entityService.create('api::store-notification.store-notification',{
        data:{
          image: notification.image,
          title: notification.title,
          body: notification.body,
          type: notification.data.type,
          nid: notification.data.nid,
          isRead: false
        }
      });
      console.log("Data entered in api::store-notification.store-notification", enter);

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
      }).then(async (response) => {
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
