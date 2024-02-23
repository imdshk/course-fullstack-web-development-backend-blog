const config = require("./utils/config")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const logger = require("./utils/logger")
const middleware = require("./utils/middleware")
const mongoose = require("mongoose")


mongoose.set("strictQuery", false)

const mongoUrl = config.MONGODB_URI

mongoose
    .connect(mongoUrl)
    .then(() => {
        logger.info("Connected to Mongo DB")
    })
    .catch((error) => {
        logger.error("Error connecting to Mongo DB", error.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app