const { Client } = require("pg");

const client = new Client({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function connect() {
  try {
    if (!client._connected) {
      await client.connect();
      console.log("Connected successfully");
    } else {
      console.log("Client already connected");
    }
    return client;
  } catch (error) {
    console.error("Error connecting:", error);
    // Reconnect if there was an error connecting
    console.log("Reconnecting...");
    await client.connect();
    console.log("Reconnected successfully");
    return client;
  }
}

// Call the connect function here itself
connect();

async function disconnect() {
  try {
    await client.end();
    console.log("Disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting:", error);
  }
}

// Export client to use client.query in controllers
module.exports = { client, connect, disconnect };
