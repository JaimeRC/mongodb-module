const createIndexes = require('./utils/createIndexes')
const {env: {MONGO_DATABASE}} = process

const indexes = [[{expireAt: 0}]]

let trigger

module.exports = class Trigger {
    static async injectDB(conn) {
        if (trigger)
            return

        try {

            trigger = await conn.db(MONGO_DATABASE).collection("triggers")

            const deleteOps = {
                $match: {
                    operationType: 'delete'
                }
            }

            await trigger.watch([deleteOps])

            trigger.on('change', this.watch)

            createIndexes(trigger, indexes, {expireAfterSeconds: 0})
        } catch (e) {
            console.error(`Unable to establish connection in triggers collection: ${e}`)
        }
    }

    static async insert(doc) {
        if (!doc._id || !doc.expireAt) throw ({message: '_id and/or expireAt are required.'})

        return await trigger.insert(doc)
    }

    static async update(filter, update, options = {}) {
        return await trigger.update(filter, update, options)
    }

    static async deleteOne(filter) {
        return await trigger.deleteOne(filter)
    }

    static async deleteMany(filter) {
        return await trigger.deleteMany(filter)
    }

    async watch(data) {
        try {
            if (data.ns.coll === 'triggers') {

            }
        } catch (e) {
            console.error('TRIGGER COLLECTION --> Error --> ', e.message)
        }
    }
}
