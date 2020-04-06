const createIndexes = require('./utils/createIndexes')
const {env: {MONGO_DATABASE}} = process

const indexes = [[{}]]

let action

module.exports = class Action {
    static async injectDB(conn) {
        if (action)
            return

        try {

            action = await conn.db(MONGO_DATABASE).collection("actions")

            //createIndexes(action, indexes, {})
        } catch (e) {
            console.error(`Unable to establish connection in actions collection: ${e}`)
        }
    }

    static async insert(doc) {
        return await action.insert(doc)
    }

    static async update(filter, update, options = {}) {
        return await action.update(filter, update, options)
    }

    static async deleteOne(filter) {
        return await action.deleteOne(filter)
    }

    static async deleteMany(filter) {
        return await action.deleteMany(filter)
    }
}
