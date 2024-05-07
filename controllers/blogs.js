const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const Comment = require("../models/comment")
const middleware = require("../utils/middleware")

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 }).populate("comments", { comment: 1 } )
    response.json(blogs)
})

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
    const body = request.body

    const user = await User.findById(request.user)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id,
    })

    const savedBlog = await blog.save()
    await blog.populate("user", { username: 1, name: 1 })
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.get("/:id", async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(id)
    response.json(blog)
})

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(id)

    if (!blog) {
        return response.status(404).json({ error: "blog not found" })
    }

    if (blog.user.toString() === request.user.toString()) {
        await Blog.findByIdAndDelete(id)
        response.status(204).end()
    } else {
        response.status(401).json({ error: "unauthorized" })
    }
})

blogsRouter.put("/:id", async (request, response) => {
    const id = request.params.id
    const body = request.body

    const blog = {
        "likes": body.likes
    }

    const updatedBLog = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.json(updatedBLog.content)
})

blogsRouter.post("/:id/comment", middleware.userExtractor, async (request, response) => {
    const id = request.params.id
    const body = request.body

    const blog = await Blog.findById(id)

    const comment = new Comment({
        comment: body.comment,
        blog: blog.id,
    })

    const savedComment = await comment.save()
    await comment.populate("blog", { id: 1 })
    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()

    response.status(201).json(savedComment)
})

module.exports = blogsRouter