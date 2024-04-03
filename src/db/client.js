const { MongoClient } = require("mongodb");

let client;

async function initializeClient() {
  if (!client) {
    client = new MongoClient("mongodb://localhost:27017");
    await client.connect();
  }

  return client;
}

module.exports = { initializeClient };
