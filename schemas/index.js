const userSchema = require('./user.schema')
const addressSchema = require('./address.schema')

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

        } catch (e) {
            console.error(`Unable to establish connection with Schemas: ${e}`)
        }
    }
}