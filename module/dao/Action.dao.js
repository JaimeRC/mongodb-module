const TAG = '[DAO - ACTION] --> '
const Trigger = require('./Trigger.dao')
const moment = require('moment')
const createIndexes = require('./utils/createIndexes')
const {env: {MONGO_DATABASE}} = process

const indexes = [{name: '_id', key: {_id: 1}}]

let action
/**
 * Clase para gestionar las Acciones
 * @type {Action}
 */
module.exports = class Action {
    /**
     * Crea la conexion a la DB
     * @param {MongoClient} conn      Conexion de Mongodb
     */
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
                            insert: () => Action.insertSession(documentKey, fullDocument),
                            update: () => Action.updateSession(documentKey, updateDescription),
                            delete: () => Action.deleteSession(documentKey),
                            drop: () => console.log(TAG, 'drop -> ', ns)
                        }

                        operations[operationType]()

                    } catch (e) {
                        console.error(TAG, ' --> Error --> ', e.message)
                    }
                })

            createIndexes(action, indexes)
        } catch (e) {
            console.error(TAG, `Unable to establish connection in actions collection: ${e}`)
        }
    }

    /**
     * Inserta una nueva Accion
     * @param {Action} doc                    Datos del Trigger
     * @param {object} options                Opciones de la insercion
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     insertedIds: Array<ObjectId>
     * }>}
     */
    static insert(doc, options) {
        const documents = typeof doc === 'object' ? [doc] : doc

        return action.insertMany(documents, options)
    }

    /**
     * Busca una Accion
     * @param {object} filter            Campos de filtrado
     * @param {object} project           Campos de devolucion
     * @returns {Promise<Action>}
     */
    static async find(filter, project = {}) {
        const document = await action.find(filter, project).toArray()

        if (document && document.length === 1) {
            return document[0]
        }
        return document
    }

    /**
     * Actualiza Acciones segun los filtros
     * @param {object} filter        Campos de filtrado
     * @param {object} update        Campos a actualizar
     * @param {object} options       Opciones de la actualizacion
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     matchedCount: number,
     *     modifiedCount: number
     * }>}
     */
    static update(filter, update, options = {}) {
        return action.updateMany(filter, update, options)
    }

    /**
     * Elimina una Accion segun los filtros
     * @param {object} filter        Campos de filtrado
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     deletedCount: number
     * }>}
     */
    static deleteOne(filter) {
        return action.deleteOne(filter)
    }

    /**
     * Elimina Accciones segun los filtros
     * @param {object} filter        Campos de filtrado
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     deletedCount: number
     * }>}
     */
    static deleteMany(filter) {
        return action.deleteMany(filter)
    }

    /**
     * Inserta una Session
     * @param {string} _id              Identificador de la Session
     * @param fullDocument
     * @returns {Promise<void>}
     */
    static async insertSession(_id, fullDocument) {
        const {nextLunch} = fullDocument
        await Trigger.insert({_id, expireAt: moment().add(nextLunch, 'seconds')})
    }

    /**
     * Actualiza una Session
     * @param {string} _id              Identificador de la Session
     * @param updateDescription
     * @returns {Promise<void>}
     */
    static async updateSession(_id, updateDescription) {
        const {updatedFields: {nextLunch}} = updateDescription
        await Trigger.update(
            {_id},
            {$set: {nextLunch: moment().add(nextLunch, 'seconds')}},
            {upsert: true})
    }

    /**
     * Elimina un Trigger segun indentificador
     * @param {string} _id        Identificador
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     deletedCount: number
     * }>}
     */
    static deleteSession(_id) {
        return Trigger.deleteOne({_id})
    }
}
