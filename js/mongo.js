const uri = "mongodb://127.0.0.1/foxcock?retryWrites=true&w=majority";

const { MongoClient } = require("mongodb");

export const getClient = async () => {
  const client = new MongoClient(uri);
  await client.connect();
  return client;
};

export const getImageFromDatabase = async () => {
  const client = await getClient();

  console.log("Connected to database");

  const collection = client.db().collection("images");

  let post = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
  while (
    post == null ||
    post.length === 0 ||
    post[0].file.ext === ("webm" || "swf") ||
    post[0].file.url == null
  ) {
    console.log("retrying...");
    post = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
    break;
  }
  console.log(post[0]);
  await client.close();
  return post;
};

export const getTime = async () => {
  const client = await getClient();

  console.log("Connected to database");

  const collection = client.db().collection("time");
  const time = await collection.findOne();
  if (time == null) {
    const time = new Date().getTime();
    await collection.insertOne(time);
  }
  await client.close();
  return time;
};

export const setTime = async (time) => {
  const client = await getClient();

  console.log("Connected to database");

  const collection = client.db().collection("time");
  await collection.updateOne({}, { $set: time });
  await client.close();
};
