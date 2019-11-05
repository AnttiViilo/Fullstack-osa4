const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const User = require("../models/user");

const initialUsers = [
  {
    username: "user1",
    name: "niko",
    password: "asdfghj"
  },
  {
    username: "user2",
    name: "nikolai",
    password: "asdgggfghj"
  }
];

beforeEach(async () => {
  await User.deleteMany({});

  let userObject = new User(initialUsers[0]);
  await userObject.save();

  userObject = new User(initialUsers[1]);
  await userObject.save();
});

test("invalid user is not added to DB", async () => {
  const newUser = {
    username: "u",
    name: "antti",
    password: "hhhh"
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(400);

  const response = await api.get("/api/users");
  console.log(response.body);
  expect(response.body.length).toBe(2);
});

afterAll(() => {
  mongoose.connection.close();
});
