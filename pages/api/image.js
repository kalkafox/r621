const e621 = require("/js/e621.js");

const mongo = require("/js/mongo.js");

let time = 0;

const handler = async (req, res) => {
  // We don't need to await for the following to finish, so await is omitted
  e621.pollData();
  console.log("Polled data");
  let tags = "";
  for (const h in req.rawHeaders) {
    const v = req.rawHeaders[h];
    if (v.toLowerCase() === "tags") {
      tags = req.rawHeaders[parseInt(h) + 1];
    }
  }

  console.log("Post aggregate complete");

  const post = await mongo.getImageFromDatabase();

  if (post.length === 0) {
    console.log("No posts found");
    console.log("couldn't get one, defaulting to e621");
    const post = e621.getOne(tags);
    res.status(200).json({ image_data: post[0] });
    return;
  }
  console.log("Got one");

  res.status(200).json({ image_data: post[0] });
};

export default handler;
