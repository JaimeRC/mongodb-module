const TAG = '[DAO - TRIGGER] --> '
const createIndexes = require('./utils/createIndexes')
const Action = require('./Action.dao')
const {env: {MONGO_DATABASE}} = process

const indexes = [{name: 'ttl', key: {expireAt: 1}, opts: {expireAfterSeconds: 0}}]

let trigger

module.exports = class Trigger {
    static async injectDB(conn) {
        if (trigger)
            return

        try {

            trigger = await conn.db(MONGO_DATABASE).collection("triggers")

            /*const deleteOps = {
                $match: {
                    operationType: 'delete'
                }
            }*/

            trigger.watch({fullDocument: 'updateLookup'})
                .on('change', async (data) => {
                    try {
                        console.log(TAG, data.operationType, ' --> ', data.documentKey)

                    } catch (e) {
                        console.error(TAG, ' Error --> ', e.message)
                    }
                })

            createIndexes(trigger, indexes)
        } catch (e) {
            console.error(TAG, `Unable to establish connection in triggers collection: ${e}`)
        }
    }

    static async insert(doc) {
        const documents = typeof doc === 'object' ? [doc] : doc

        for (const document of documents) {
            if (!document._id || !document.expireAt) throw ({message: '_id and/or expireAt are required.'})
        }

        return await trigger.insertMany(documents)
    }

    static async find(filter, project = {}) {
        return await trigger.find(filter, project).toArray()
    }

    static async update(filter, update, options = {}) {
        return await trigger.updateMany(filter, update, options)
    }

    static async deleteOne(filter) {
        return await trigger.deleteOne(filter)
    }

    static async deleteMany(filter) {
        return await trigger.deleteMany(filter)
    }
}
