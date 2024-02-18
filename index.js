const config = require("./utils/config")
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const blogsRouter = require("./controllers/blogs")

mongoose.set("strictQuery", false)

const mongoUrl = config.MONGODB_URI

mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log("Connected to Mongo DB")
    })
    .catch((error) => {
        console.log("Error connecting to Mongo DB", error.message)
    })

app.use(cors())
app.use(express.json())

app.use("/api/blogs", blogsRouter)

const PORT = config.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})