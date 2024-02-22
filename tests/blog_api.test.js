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

test("check whether unique identifier proterty is returned as id", async () => {
    const response = await  api.get("/api/blogs")
    let hasIdProperty = false
    if (response.body[0].id) {
        hasIdProperty = true
    }
    assert.strictEqual(hasIdProperty, true)
})

test.only("a valid blog is added", async () => {
    const newBlog = {
        "title": "Test blog 3",
        "author": "Imaad Shaik",
        "url": "",
        "likes": 1
    }

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/blogs")

    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes("Test blog 3"))
})

after(async () => {
    await mongoose.connection.close()
})