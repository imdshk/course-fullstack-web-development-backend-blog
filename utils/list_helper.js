const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (totalLikes, blog) => {
        return totalLikes + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

module.exports = {
    dummy,
    totalLikes
}