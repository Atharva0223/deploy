module.exports = {
  async modify(ctx) {
    const {
      uniqueId,
      deviceId,
      osVersion,
      osName,
      devicePlatform,
      appVersion,
      deviceTimezone,
      deviceCurrentTimestamp,
      token,
      modelName,
    } = ctx.request.body;

    console.log("ctx.request.body", ctx.request.body.deviceId);

    // all fields are required
    if (
      !uniqueId ||
      !deviceId ||
      !osVersion ||
      !osName ||
      !devicePlatform ||
      !appVersion ||
      !token ||
      !modelName
    ) {
      return ctx.badRequest(null, [
        { messages: [{ id: "All fields are required" }] },
      ]);
    }

    //check if device exists
    console.log(deviceId);
    
    const exists = await strapi
      .query("api::device-info.device-info")
      .findOne({ where: { deviceId: deviceId } });

    console.log(exists);

    if (exists == null) {
      console.log("inside insert");
      const insert = await strapi.query("api::device-info.device-info").create({
        data: {
          uniqueId,
          deviceId,
          osVersion,
          osName,
          devicePlatform,
          appVersion,
          deviceTimezone,
          deviceCurrentTimestamp,
          token,
          modelName,
        },
      });
    } else if (exists != null) {
      console.log("inside update");
      const update = await strapi.query("api::device-info.device-info").update({
        where: { deviceId: deviceId },
        data: {
          uniqueId,
          deviceId,
          osVersion,
          osName,
          devicePlatform,
          appVersion,
          deviceTimezone,
          deviceCurrentTimestamp,
          token,
          modelName,
        },
      });
    }

    //send response ?
    ctx.send({
      message: "Successful",
    });
  },
};
