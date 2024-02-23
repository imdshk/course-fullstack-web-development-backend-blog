const bcrypt = require("bcrypt")
const userRouter = require("express").Router()
const User = require("../models/user")

userRouter.post("/", async (request, response) => {
    const { username, name, password } = request.body
    if (password.length < 3) {
        return response.status(400).json({ error: "User validation failed: password: Path `password` is shorter than the minimum allowed length (3)." })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

userRouter.get("/", async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

module.exports = userRouter