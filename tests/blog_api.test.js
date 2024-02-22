const { test, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")
const Blog = require("../models/blog")

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    let noteObject = new Blog(helper.initialBlogs[0])
    await noteObject.save()
    noteObject = new Blog(helper.initialBlogs[1])
    await noteObject.save()
})

test("blogs are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-type", /application\/json/)
})

test("there are 2 blogs", async () => {
    const response = await api.get("/api/blogs")

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only("check whether unique identifier proterty is returned as id", async () => {
    const response = await  api.get("/api/blogs")
    let hasIdProperty = false
    if (response.body[0].id) {
        hasIdProperty = true
    }
    assert.strictEqual(hasIdProperty, true)
})

after(async () => {
    await mongoose.connection.close()
})