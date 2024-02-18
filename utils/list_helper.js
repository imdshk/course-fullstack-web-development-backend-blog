const dummy = (blogs) => {
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

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}