const { initializeClient } = require("./client");

async function insert(domain) {
  const client = await initializeClient();
  const db = client.db("app");
  const collection = db.collection("domains");

  await collection.insertOne(domain);

  return "done";
}

async function search(keyword) {
  const client = await initializeClient();

  const db = client.db("app");
  const collection = db.collection("domains");
  const regex = new RegExp(keyword);
  const query = {
    txt_records: regex,
  };

  return await collection.find(query).toArray();
}

module.exports = {
  insert,
  search,
};
