const config = require("./utils/config")
const express = require("express")
const app = express()
const cors = require("cors")
const blogsRouter = require("./controllers/blogs")
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

const PORT = config.PORT
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})