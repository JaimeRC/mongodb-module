const createIndexes = require('./utils/createIndexes')
const {env: {MONGO_DATABASE}} = process

const indexes = [[{name: 'ttl', key: {expireAt: 1}}]]

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

            const changeStream = trigger.watch()

            changeStream.on('change', (data) => {
                try {

                    console.log('TRIGGER DAO --> ', data.operationType, data.ns, data.documentKey)
                } catch (e) {
                    console.error('TRIGGER COLLECTION --> Error --> ', e.message)
                }
            })

            createIndexes(trigger, indexes, {expireAfterSeconds: 0})
        } catch (e) {
            console.error(`Unable to establish connection in triggers collection: ${e}`)
        }
    }

    static async insert(doc) {
        const documents = typeof doc === 'object' ? [doc] : doc

        for(const document of documents){
            if (!document._id || !document.expireAt) throw ({message: '_id and/or expireAt are required.'})
        }

        return await trigger.insertMany(documents)
    }

    static async find(filter, project = {}) {
        const document = await trigger.find(filter, project)

        if (document && document.length === 1) {
            return document[0]
        }
        return document
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
