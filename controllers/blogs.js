const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//const getTokenFrom = request => {

//   const authorization = request.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     return authorization.substring(7);
//   }
//   return null;
// };

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  console.log(body);
  if (body.likes === undefined || body.likes === null) {
    body.likes = 0;
  }

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.json(savedBlog.toJSON());
  } catch (exeption) {
    console.log(exeption);
    next(exeption);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }
    const user = await User.findById(decodedToken.id);
    console.log(user.id);
    const blog = await Blog.findById(request.params.id);
    console.log(blog.user);

    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      console.log(`blog ${request.params.id} removed`);
    } else {
      console.log("cannot remove blog: wrong user");
      response.status(401).end();
    }

    response.status(204).end();
  } catch (exeption) {
    next(exeption);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const find = await Blog.findById(request.params.id);
  const body = request.body;
  const blogi = {
    title: find.title,
    author: find.author,
    url: find.url,
    likes: body.likes
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogi, {
      new: true
    });

    response.json(updatedBlog.toJSON());
  } catch (exeption) {
    next(exeption);
  }
});

module.exports = blogsRouter;
