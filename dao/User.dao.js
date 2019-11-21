const createIndexes = require('./utils/createIndexes')

const indexes = [[{name: 1}]]

let users


module.exports = class User {
    static async injectDB(conn) {
        if (users)
            return

        try {

            users = await conn.db(process.env.DB_TEST).collection("users")

            createIndexes(users, indexes, {})
        } catch (e) {
            console.error(`Unable to establish connection in passenger collection: ${e}`)
        }
    }

    static async insertOne(user, opt = {}) {
        return await users.insertOne(user, opt)
    }

    static async findOne(query) {
        return await users.findOne(query)
    }

    static async updateOne(query, update) {
        return await users.updateOne(query, update)
    }

    static async deleteOne(query) {
        return await users.deleteOne(query)
    }

}