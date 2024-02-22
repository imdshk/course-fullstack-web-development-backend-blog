const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.get("/:id", async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(id)
    response.json(blog)
})

blogsRouter.delete("/:id", async (request, response) => {
    const id = request.params.id
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
    const id = request.params.id
    const body = request.body

    const blog = {
        // "title": body.title,
        // "author": body.author,
        // "url": body.url,
        "likes": body.likes
    }

    const updatedBLog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.json(updatedBLog.content)
})

module.exports = blogsRouter