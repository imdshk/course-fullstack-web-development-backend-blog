const Blog = require("../models/blog")
const User = require("../models/user")

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

// blogs
const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const getBlogById = async (id) => {
    const blog = await Blog.findById(id)
    return blog.toJSON()
}

// users
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
    getBlogById,
    usersInDb
}
