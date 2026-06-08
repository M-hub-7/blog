const express = require("express");
const mongoose = require("mongoose");
const app = express();
mongoose.set("strictQuery", false);
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);
const mongoUrl = `mongodb+srv://mfendemdaina:GuileneDaina@cluster0.af990ut.mongodb.net/blogList?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(mongoUrl);
app.use(express.json());

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);
  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
