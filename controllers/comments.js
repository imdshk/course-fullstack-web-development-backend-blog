const commentsRouter = require("express").Router()
const Blog = require("../models/blog")
const Comment = require("../models/comment")
const middleware = require("../utils/middleware")

commentsRouter.post("/:id/comment", middleware.userExtractor, async (request, response) => {
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

module.exports = commentsRouter