const {User, Address} = require('./')

let session
module.exports = class Transactions {
    static async injectDB(conn) {
        if (session) {
            return
        }
        try {
            await User.injectDB(conn)
            await Address.injectDB(conn)
            session = await conn.startSession()
        } catch (e) {
            console.error(`Unable to establish connection in Transactions: ${e}`)
        }
    }

    // The actual transfer logic
    static async createUserWithAddress(user, address) {
        try {
            session.startTransaction()

            const opts = {session}

            const newUser = await User.insertOne(user, opts)

            console.log('User', newUser)

            address.user = newUser._id

            const newAddress = await Address.insertOne(address, opt)

            console.log(newAddress)

            await session.commitTransaction();

            newUser.address = address
            await session.endSession();

            return newUser;

        } catch (error) {
            // If an error occurred, abort the whole transaction and
            // undo any changes that might have happened
            await session.abortTransaction();
            session.endSession();
            throw error; // Rethrow so calling function sees error
        }
    }
}