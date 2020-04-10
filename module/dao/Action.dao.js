const TAG = '[DAO - ACTION] --> '
const Trigger = require('./Trigger.dao')
const moment = require('moment')
const createIndexes = require('./utils/createIndexes')
const {env: {MONGO_DATABASE}} = process

const indexes = [[{name: '_id', key: {_id: 1}}]]

let action

module.exports = class Action {
    static async injectDB(conn) {
        if (action)
            return

        try {

            action = await conn.db(MONGO_DATABASE).collection("actions")

            action.watch()
                .on('change', (data) => {
                    try {

                        const {operationType, fullDocument, documentKey, updateDescription, ns} = data

                        const operations = {
                            insert:  () => Action.insertSession(documentKey, fullDocument),
                            update: () => Action.updateSession(documentKey, updateDescription),
                            delete: () => Action.deleteSession(documentKey),
                            drop: () => console.log(TAG, 'drop -> ', ns)
                        }

                        operations[operationType]()

                    } catch (e) {
                        console.error(TAG, ' --> Error --> ', e.message)
                    }
                })

            createIndexes(action, indexes, {})
        } catch (e) {
            console.error(TAG, `Unable to establish connection in actions collection: ${e}`)
        }
    }

    static async insert(doc) {
        const documents = typeof doc === 'object' ? [doc] : doc

        return await action.insertMany(documents)
    }

    static async find(filter, project = {}) {
        const document = await action.find(filter, project).toArray()

        if (document && document.length === 1) {
            return document[0]
        }
        return document
    }

    static async update(filter, update, options = {}) {
        return await action.updateMany(filter, update, options)
    }

    static async deleteOne(filter) {
        return await action.deleteOne(filter)
    }

    static async deleteMany(filter) {
        return await action.deleteMany(filter)
    }

    static async insertSession(_id, fullDocument) {
        const {nextLunch} = fullDocument
        await Trigger.insert({_id, expireAt: moment().add(nextLunch, 'seconds')})
    }

    static async updateSession(_id, updateDescription) {
        const {updatedFields: {nextLunch}} = updateDescription
        await Trigger.update(
            {_id},
            {$set: {nextLunch: moment().add(nextLunch, 'seconds')}},
            {upsert: true})
    }

    static async deleteSession(_id) {
        await Trigger.deleteOne({_id})
    }

}
