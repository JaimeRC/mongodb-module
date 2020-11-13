const createIndexes = require('./utils/createIndexes')
const {env: {MONGO_DATABASE}} = process

const indexes = [{name: 'name', key: {name: 1}}]

let users

/**
 * Clase para gestionar los Usuarios
 * @type {User}
 */
module.exports = class User {
    /**
     * Crea la conexion a la DB
     * @param {MongoClient} conn      Conexion de Mongodb
     */
    static async injectDB(conn) {
        if (users)
            return

        try {

            users = await conn.db(MONGO_DATABASE).collection("users")

            createIndexes(users, indexes, {})
        } catch (e) {
            console.error(`Unable to establish connection in users collection: ${e}`)
        }
    }

    /**
     * Inserta un nuevo Usuario
     * @param {User} user               Datos del Trigger
     * @param {object} opt              Opciones de la insecion
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     insertedId: number
     * }>}     */
    static insertOne(user, opt = {}) {
        return users.insertOne(user, opt)
    }

    /**
     * Busca un Usuario
     * @param {object} filter            Campos de filtrado
     * @param {object} project           Campos de devolucion
     * @returns {Promise<User>}
     */
    static findOne(filter, project = {}) {
        return users.findOne(filter, project)
    }

    /**
     * Actualiza un Usuario segun los filtros
     * @param {object} filter        Campos de filtrado
     * @param {object} update        Campos a actualizar
     * @param {object} options       Opciones de la actualizacion
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     matchedCount: number,
     *     modifiedCount: number
     * }>}     */
    static updateOne(filter, update, options = {}) {
        return users.updateOne(filter, update, options)
    }

    /**
     * Elimina un Usuario segun los filtros
     * @param {object} filter        Campos de filtrado
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     deletedCount: number
     * }>}     */
    static deleteOne(filter) {
        return users.deleteOne(filter)
    }
}
