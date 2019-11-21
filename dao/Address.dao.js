const createIndexes = require('./utils/createIndexes')

const indexes = [[{location: '2dsphere'}]]

let addresses

module.exports = class Address {
    static async injectDB(conn) {
        if (addresses)
            return

        try {
            addresses = await conn.db(process.env.DB_TEST).collection("addresses")

            createIndexes(addresses, indexes, {})
        } catch (e) {
            console.error(`Unable to establish connection in passenger collection: ${e}`)
        }
    }

    static async insertOne(address, opt = {}) {
        return await addresses.insertOne(address, opt)
    }

    static async findOne(query) {
        return await addresses.findOne(query)
    }

    static async updateOne(query, update) {
        return await addresses.updateOne(query, update)
    }

    static async deleteOne(query) {
        return await addresses.deleteOne(query)
    }

}