const { test, after, beforeEach, describe } = require("node:test")
const assert = require("node:assert")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require ("../app")
const helper = require("./test_helper")
const User = require("../models/user")

const api = supertest(app)

describe("when there is initially one user in the db", () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash("secret", 10)
        const user = new User({
            username: "root",
            name: "superuser",
            passwordHash
        })
        const user2 = new User({
            username: "test",
            name: "testuser",
            passwordHash
        })

        await user.save()
        await user2.save()
    })

    test("creation of user succeeds with status code 201", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "imd",
            name: "Imaad Shaik",
            password: "newPasswordVerySafe"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-type", /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        assert(usernames.includes(newUser.username))
    })

    test("creation of user fails with status code 400 if username is already taken", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "root",
            name: "new User",
            password: "newPasswordVerySafe"
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-type", /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert(result.body.error.includes("expected 'username' to be unique"))
    })

    test("creation of user fails with status code 400 if username length is less than 3", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "ab",
            name: "Username Fail",
            password: "newPasswordVerySafe"
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-type", /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert(result.body.error.includes("User validation failed: username:"))

        const usernames = usersAtEnd.map(user => user.username)
        assert(!usernames.includes(newUser.username))
    })

    test("creation of user fails with status code 400 if password length is less than 3", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "passwordFail",
            name: "Password Fail",
            password: "12"
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-type", /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert(result.body.error.includes("User validation failed: password:"))

        const usernames = usersAtEnd.map(user => user.username)
        assert(!usernames.includes(newUser.username))
    })
})


after(async () => {
    await mongoose.connection.close()
})