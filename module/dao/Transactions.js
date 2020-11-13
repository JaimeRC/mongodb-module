const {env: {MONGO_DATABASE}} = process

let session, db

/**
 * Clase para gestionar las Transacciones
 * @type {Transactions}
 */
module.exports = class Transactions {

    /**
     * Crea la conexion a la DB y genera la session
     * @param {MongoClient} conn      Conexion de Mongodb
     */
    static async injectDB(conn) {
        if (session && db) return

        try {
            session = await conn.startSession()
            db = await conn.db(MONGO_DATABASE)
        } catch (e) {
            console.error(`Unable to establish connection in Transactions: ${e}`)
        }
    }

    // The actual transfer logic
    /**
     * Transaccion que genera un usuario y su direccion.
     * @param {User} user         Datos del usuario
     * @param {Address} address   Datos de la direccion
     * @returns {Promise<User>}   Datos del usuario almacenado en la DB
     */
    static async createUserWithAddress(user, address) {
        try {
            session.startTransaction()

            const newAddress = await db.collection("addresses").insertOne(address, {session})

            user.address = newAddress._id

            const newUser = await db.collection("users").insertOne(user, {session})

            newUser.address = address

            await session.commitTransaction();

            return newUser;

        } catch (error) {
            // Si ocurre un error, aborta la transaccion y
            // se deshacer los cambios que hayan podido realizarse.
            await session.abortTransaction();
            throw error // Relanzamos el error
        } finally {
            session.endSession();
        }
    }
}
