const TAG = '[DAO - TRIGGER] --> '
const createIndexes = require('./utils/createIndexes')
const Action = require('./Action.dao')
const {env: {MONGO_DATABASE}} = process

const indexes = [{name: 'ttl', key: {expireAt: 1}, opts: {expireAfterSeconds: 0}}]

let trigger
/**
 * Clase para gestionar los Triggers
 * @type {Trigger}
 */
module.exports = class Trigger {
    /**
     * Crea la conexion a la DB
     * @param {MongoClient} conn      Conexion de Mongodb
     */
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

    /**
     * Inserta un nuevo trigger
     * @param {Trigger} doc               Datos del Trigger
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     insertedId: number
     * }>}
     */
    static insert(doc) {
        const documents = typeof doc === 'object' ? [doc] : doc

        for (const document of documents) {
            if (!document._id || !document.expireAt) throw ({message: '_id and/or expireAt are required.'})
        }

        return trigger.insertMany(documents)
    }

    /**
     * Busca un trigger
     * @param {object} filter        Campos de filtrado
     * @param {object} project       Campos de devolucion
     * @returns {Promise<Array<Trigger>>}
     */
    static find(filter, project = {}) {
        return trigger.find(filter, project).toArray()
    }

    /**
     * Actualiza los trigger segun los filtros
     * @param {object} filter        Campos de filtrado
     * @param {object} update        Campos a actualizar
     * @param {object} options       Opciones de la actualizacion
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     matchedCount: number,
     *     modifiedCount: number
     * }>}     */
    static update(filter, update, options = {}) {
        return trigger.updateMany(filter, update, options)
    }

    /**
     * Busca y actualiza un trigger
     * @param {object} filter        Campos de filtrado
     * @param {object} update        Campos a actualizar
     * @param {object} options       Opciones de la actualizacion
     * @returns {Promise<Trigger>}
     */
    static findOneAndUpdate(filter, update, options = {}) {
        return trigger.findOneAndUpdate(filter, update, options)
    }

    /**
     * Elimina un trigger
     * @param {object} filter        Campos de filtrado
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     deletedCount: number
     * }>}     */
    static deleteOne(filter) {
        return trigger.deleteOne(filter)
    }

    /**
     * Elimina los trigger segun los filtros
     * @param {object} filter        Campos de filtrado
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     deletedCount: number
     * }>}
     */
    static async deleteMany(filter) {
        return await trigger.deleteMany(filter)
    }
}
