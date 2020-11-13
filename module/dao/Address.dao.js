const {env: {MONGO_DATABASE}} = process
const createIndexes = require('./utils/createIndexes')

const indexes = [{name: 'geolocation', key: {location: '2dsphere'}}]

let addresses
/**
 * Clase para gestionar las Direccions
 * @type {Address}
 */
module.exports = class Address {
    /**
     * Crea la conexion a la DB
     * @param {MongoClient} conn      Conexion de Mongodb
     */
    static async injectDB(conn) {
        if (addresses)
            return

        try {
            addresses = await conn.db(MONGO_DATABASE).collection("addresses")

            createIndexes(addresses, indexes)
        } catch (e) {
            console.error(`Unable to establish connection in addresses collection: ${e}`)
        }
    }

    /**
     * Inserta una nueva Direccion
     * @param {Address} address               Datos del Trigger
     * @param {object} options                Opciones de la insecion
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     insertedId: number
     * }>}
     */
    static insertOne(address, options = {}) {
        return addresses.insertOne(address, options)
    }

    /**
     * Busca un Usuario
     * @param {object} filter            Campos de filtrado
     * @param {object} project           Campos de devolucion
     * @returns {Promise<Address>}
     */
    static findOne(filter, project = {}) {
        return addresses.findOne(filter, project)
    }

    /**
     * Actualiza una Direccion segun los filtros
     * @param {object} filter        Campos de filtrado
     * @param {object} update        Campos a actualizar
     * @param {object} options       Opciones de la actualizacion
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     matchedCount: number,
     *     modifiedCount: number
     * }>}
     */
    static updateOne(filter, update, options = {}) {
        return addresses.updateOne(query, update)
    }

    /**
     * Elimina una Direccion segun los filtros
     * @param {object} filter        Campos de filtrado
     * @returns {Promise<{
     *     acknowledged: boolean,
     *     deletedCount: number
     * }>}
     */
    static deleteOne(filter) {
        return addresses.deleteOne(filter)
    }
}
