const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "HTML",
    author: "antti",
    url: "www,html.fi",
    likes: 5
  },
  {
    title: "postaus",
    author: "antti",
    url: "www,postaus.fi",
    likes: 3
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("posts are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two posts", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body.length).toBe(2);
});

test("id field defined", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

test("post without title and url", async () => {
  const newPost2 = {
    author: "antti",
    likes: 2
  };
  await api
    .post("/api/blogs")
    .send(newPost2)
    .expect(400);
});

test("add new post can be added", async () => {
  const newPost = {
    title: "uusipostaus",
    author: "antti",
    url: "www.uusipostaus.fi",
    likes: null
  };

  await api
    .post("/api/blogs")
    .send(newPost)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  console.log(response.body);
  expect(response.body.length).toBe(initialBlogs.length + 1);
  expect(response.body[response.body.length - 1].likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});
