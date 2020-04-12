const TAG = '[JSON SCHEMA VALIDATION] --> '
const userSchema = require('./user.schema')
const addressSchema = require('./address.schema')
const triggerSchema = require('./trigger.schema')
const actionSchema = require('./action.schema')

let connection

/**
 * Clase donde se injectan todos los esquemas de validacion en todas las colecciones
 *
 * @type {module.Schemas}
 */
module.exports = class Schemas {
    static async injectDB(conn) {
        try {

            if (!connection)
                connection = conn

            const db = await connection.db(process.env.MONGO_DATABASE)

            await db.createCollection('users', userSchema)
            await db.createCollection('addresses', addressSchema)
            await db.createCollection('triggers', triggerSchema)
            await db.createCollection('actions', actionSchema)

            console.log(TAG, 'is active.')
        } catch (e) {
            console.error(TAG, `Unable to establish connection with Schemas: ${e.message}`)
        }
    }
}
