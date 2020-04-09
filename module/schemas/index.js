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

            await connection.db(process.env.DB_TEST).runCommand(userSchema)
            await connection.db(process.env.DB_TEST).runCommand(addressSchema)
            await connection.db(process.env.DB_TEST).runCommand(triggerSchema)
            await connection.db(process.env.DB_TEST).runCommand(actionSchema)

        } catch (e) {
            console.error(`Unable to establish connection with Schemas: ${e.message}`)
        }
    }
}
