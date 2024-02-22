const { test, after, beforeEach, describe } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")
const Blog = require("../models/blog")

const api = supertest(app)

describe("When there is initially some blogs saved", () => {
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

    describe("adding a new blog", () => {
        test("a valid blog is added", async () => {
            const newBlog = {
                "title": "Test blog 3",
                "author": "Imaad Shaik",
                "url": "url3",
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

        test("adding a blog without likes", async () => {
            const newBlog = {
                "title": "Test blog without likes",
                "author": "Imaad Shaik",
                "url": "abcd"
            }

            const response = await api
                .post("/api/blogs")
                .send(newBlog)
                .expect(201)
                .expect("Content-Type", /application\/json/)

            assert.strictEqual(response.body.likes, 0)
        })

        test("adding a blog without title or url", async () => {
            const newBlog = {
                "title": "",
                "author": "Imaad Shaik",
            }

            await api
                .post("/api/blogs")
                .send(newBlog)
                .expect(400)
        })

        describe("deletion of a blog", () => {
            test("succeed with status code 204 if blog is deleted", async () => {
                const blogAtStart = await helper.blogsInDb()
                const blogToDelete = blogAtStart[0]

                await api
                    .delete(`/api/blogs/${blogToDelete.id}`)
                    .expect(204)

                const blogsAtEnd = await helper.blogsInDb()

                assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
            })
        })

        describe("updating a blog post", () => {
            test("succeed with status code 200 and return back the updated content", async () => {
                const blogsAtStart = await helper.blogsInDb()
                const blogToUpdate = blogsAtStart[0]

                blogToUpdate.likes = 50

                await api
                    .put(`/api/blogs/${blogToUpdate.id}`)
                    .send(blogToUpdate)
                    .expect(200)

                const updatedBlog = await helper.getBlogById(blogToUpdate.id)
                assert.strictEqual(updatedBlog.likes, 50)
            })
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})