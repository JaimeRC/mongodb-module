const {env: {MONGO_DATABASE}} = process
//const {User, Address} = require('./')
let session, users, addresses

module.exports = class Transactions {
    static async injectDB(conn) {
        if (session)
            return

        try {
            session = await conn.startSession()
            users = await conn.db(MONGO_DATABASE).collection("users")
            addresses = await conn.db(MONGO_DATABASE).collection("addresses")

        } catch (e) {
            console.error(`Unable to establish connection in Transactions: ${e}`)
        }
    }

    // The actual transfer logic
    static async createUserWithAddress(user, address) {
        try {
            session.startTransaction()

            const newAddress = await addresses.insertOne(address, {session})

            user.address = newAddress._id

            const newUser = await users.insertOne(user, {session})

            await session.commitTransaction();

            newUser.address = address
            await session.endSession();

            return newUser;

        } catch (error) {
            // If an error occurred, abort the whole transaction and
            // undo any changes that might have happened
            await session.abortTransaction();
            throw error; // Rethrow so calling function sees error
        } finally {
            session.endSession();
        }
    }
}
