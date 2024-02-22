const Blog = require("../models/blog")

const initialBlogs = [
    {
        "title": "Test blog 1",
        "author": "Imaad Shaik",
        "url": "",
        "likes": 5
    },
    {
        "title": "Test blog 2",
        "author": "Imaad Shaik",
        "url": "",
        "likes": 1
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb
}
