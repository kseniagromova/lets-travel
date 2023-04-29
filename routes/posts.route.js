let uniqid = require("uniqid");
let Post = require("../models/post.model").Post;
let express = require("express");
let router = express.Router();
let authMiddleware = require("../middleware/auth");

router.get("/", async (req, res) => {
  let posts = await Post.find();
  res.send(posts);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let post = await Post.findOne({ id });
  res.send(post);
});

router.post("/", authMiddleware, async (req, res) => {
  let reqBody = req.body;
  let imgPath;
  if (reqBody.imageURL) {
    imgPath = reqBody.imageURL;
  } else {
    imgPath = "/images/" + req.file.filename;
  }
  let newPost = new Post({
    id: uniqid(),
    title: reqBody.title,
    date: new Date(),
    description: reqBody.description,
    text: reqBody.text,
    country: reqBody.country,
    imageURL: imgPath,
  });
  await newPost.save();
  res.send("Created");
});

router.delete("/:id", authMiddleware, async (req, res) => {
  let id = req.params.id;
  await Post.deleteOne({ id });
  res.send("Deleted");
});

router.put("/:id", authMiddleware, async (req, res) => {
  let id = req.params.id;
  await Post.updateOne({ id }, req.body);
  res.send("Updated");
});

module.exports = router;
