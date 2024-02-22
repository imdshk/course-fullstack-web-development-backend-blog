const Blog = require("../models/blog")

const initialBlogs = [
    {
        "title": "Test blog 1",
        "author": "Imaad Shaik",
        "url": "url1",
        "likes": 5
    },
    {
        "title": "Test blog 2",
        "author": "Imaad Shaik",
        "url": "url1",
        "likes": 1
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const getBlogById = async (id) => {
    const blog = await Blog.findById(id)
    return blog.toJSON()
}

module.exports = {
    initialBlogs,
    blogsInDb,
    getBlogById
}
