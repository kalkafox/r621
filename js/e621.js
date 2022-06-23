const b64 = require("./base64.js");

const { MongoClient } = require("mongodb");

const mongo = require("./mongo.js");

const uri = "mongodb://127.0.0.1/foxcock?retryWrites=true&w=majority";

let time = new Date().getTime() / 1000;

const e621 = async (limit, tags) => {
  const url = `https://e621.net/posts.json?limit=${limit}&tags=order:random+rating:e${
    tags === "" ? "" : "+"
  }${tags}`;

  const response = await fetch(url, {
    headers: { "User-Agent": "foxcock.us 2.0 / (made by Kalka)" },
  });
  const json = await response.json();
  return json.posts;
};

// TODO: Separate collection between pseudorandom (with predefined tags) and user defined tags

export const getOne = async (tags) => {
  let image = await e621(1, tags);
  while (image.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    image = await e621(1, tags);
    break;
  }
  return image;
};

const limit = 320;

export const pollData = async (tags) => {
  const time = await mongo.getTime();
  console.log(time);

  const timestamp = new Date().getTime();
  console.log(timestamp);
  if (timestamp > time.time) {
    console.log("yote3");
    return;
  } else {
    await mongo.setTime({ time: timestamp + 300 });
  }

  const client = await mongo.getClient();

  const collection = client.db().collection("images");

  const posts = await e621(limit, "m/m+-intersex+-female");

  let duplicates = 0;

  for (const post of posts) {
    const existingImage = await collection.findOne({ id: post.id });
    if (existingImage != null) {
      duplicates++;
      continue;
    }
    await client.db().collection("images").insert(post);
  }

  console.log(
    `Acquired ${posts.length} posts! of which ${duplicates} were duplicates`
  );

  await client.close();
};
