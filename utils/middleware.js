const logger = require("./logger")
const jwt = require("jsonwebtoken")

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method)
    logger.info("Path:", request.path)
    if (!((request.path === "/api/users" || request.path === "/api/login") && request.method === "POST")) {
        logger.info("Body:", request.body)
    }
    logger.info("---")
    next()
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get("authorization")
    if (authorization && authorization.startsWith("Bearer")) {
        request.token = authorization.replace("Bearer ", "")
    }
    next()
}

const userExtractor = (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = decodedToken.id
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if(error.name === "CastError") {
        return response.status(400).send({ error: "malformed id" })
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    } else if (error.name === "MongoServerError" && error.message.includes("E11000 duplicate key error collection")) {
        return response.status(400).json({ error: "expected 'username' to be unique" })
    } else if (error.name === "JsonWebTokenError" && error.message.includes("invalid signature")) {
        return response.status(401).json({ error: "invalid token" })
    } else if (error.name === "TypeError" && error.message.includes("Cannot read properties of null (reading 'user')")) {
        return response.status(404).json({ error: "blog not found" })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(400).send({ error: "unknown endpoint" })
}

module.exports = {
    requestLogger,
    tokenExtractor,
    userExtractor,
    errorHandler,
    unknownEndpoint
}