module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  "generate-data": {
    enabled: true,
},
'strapi-plugin-fcm': {
  enabled: true,
  resolve: './src/plugins/strapi-plugin-fcm', // path to plugin folder
  options: {
      apiKey: env('FCM_API_KEY'), // Your FCM API Key
    },
},
});
