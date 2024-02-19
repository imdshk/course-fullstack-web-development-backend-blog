const _ = require("lodash")

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (totalLikes, blog) => {
        return totalLikes + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    const reducer = (favourite, blog) => {
        return favourite.likes > blog.likes
            ? favourite
            : blog
    }

    return blogs.reduce(reducer, { likes: 0 })
}

const mostBlogs = (blogs) => {
    const reducer = _(blogs)
        .groupBy("author")
        .map((blog, id) => ({
            author: id,
            blogs: _.countBy(blog, "counts").undefined
        }))
        .value()

    return _.maxBy(reducer, "blogs")
}

const mostLikes = (blogs) => {
    const reducer = _(blogs)
        .groupBy("author")
        .map((blog, id) => ({
            author: id,
            likes: _.sumBy(blog, "likes")
        }))
        .value()
    return _.maxBy(reducer, "likes")
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}