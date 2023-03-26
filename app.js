const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();

const homeStartingContent =
  "Welcome to my blog website! Here, you can share your ideas, thoughts, and stories with the world. If you're interested in writing blogs, you've come to the right place!To get started, simply go to /compose to create and publish your new blog. It's easy and intuitive - just write your post, and hit publish. Your blog will be live on the homepage for everyone to see.If you're looking for inspiration, you can check out the latest blogs from other writers on the homepage. You'll find a variety of topics and styles - from personal essays to informative how-to guides. It's a great way to get a sense of what's possible and to connect with other writers.So why wait? Start writing your first blog post today and share your voice with the world. We can't wait to see what you come up with!";

const aboutContent =
  "Welcome to my blog! Here, I believe in the power of words to connect people and spark change. My platform is designed to give writers like you a space to share your ideas, stories, and experiences with an online audience.My mission is to create a community of writers and readers who are passionate about exploring the world and sharing their perspectives. Whether you're a seasoned writer or just starting out, I welcome you to join me.My platform is designed to be user-friendly and intuitive, with a simple interface that makes it easy to create and publish your content. You can write about anything that interests you, from personal reflections to informative articles on a wide range of topics.I believe in the power of storytelling to change hearts and minds, and I'm committed to providing a platform where everyone's voice can be heard. So why wait? Join me today and start sharing your stories with the world. I can't wait to read what you have to say!";

const contactContent =
  "Thank you for visiting my blog! I'm always excited to hear from readers and fellow writers. Whether you have a question, comment, or just want to say hello, I invite you to reach out to me using my email below.If you're interested in collaborating on a project, feel free to send me a message with your ideas and we can discuss further. I'm always looking for new ways to connect with other writers and create meaningful content.If you have any feedback or suggestions for how I can improve my blog, I would love to hear them. I'm committed to providing a platform that is informative, engaging, and inclusive, and your input is invaluable in helping me achieve that goal.Thank you again for your interest in my blog. I look forward to hearing from you soon!";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose.connect("mongodb://0.0.0.0:27017/blogDB", { useNewUrlParser: true });

mongoose.connect("mongodb+srv://" +`${process.env.ID}` +"@cluster0.ayqboii.mongodb.net/blogDB",{useNewUrlParser: true,}
);

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find().then((posts) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post
    .save()
    .then(() => {
      console.log("Post added to DB.");

      res.redirect("/");
    })

    .catch((err) => {
      res.status(400).send("Unable to save post to database.");
    });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }).then((post) => {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
