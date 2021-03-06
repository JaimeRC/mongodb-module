const {MongoClient} = require("mongodb")
const {env: {MONGO_RS_NAME, MONGO_URI, MONGO_DATABASE}} = process
const {expect} = require('chai')


describe("MongoClient testing", async () => {

    it("Client initialized with URI and options", async () => {

        let testClient
        try {
            testClient = await MongoClient.connect(
                MONGO_URI,
                {
                    replicaSet: MONGO_RS_NAME,                              //nombre del replica set
                    //maxPoolSize: 100,                            //numero de conexiones para el pool creado
                    w: 1,                                        //confirmación de inserción en un solo nodo
                    wtimeout: 2000,                              //tiempo máximo para la insercion
                    readPreference: 'primaryPreferred',          //preferencia del nodo de lectura
                    autoReconnect: true,                         //reconectarse a la BD
                    reconnectTries: 30,                          //Intentos de reconeccion
                    reconnectInterval: 1000,                     //Intervalo de reconeccion
                    connectTimeoutMS: 200,
                    retryWrites: true,                           // reintento de escritura (solo uno)
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }
            )

            const clientOptions = testClient.s.options

            // expect clientOptions to have the correct settings
            expect(clientOptions.replicaSet).to.equal(MONGO_RS_NAME)
           // expect(clientOptions.maxPoolSize).to.equal(100)
            expect(clientOptions.w).to.equal(1)
            expect(clientOptions.wtimeout).to.equal(2000)
            expect(clientOptions.readPreference.mode).to.equal('primaryPreferred')
            expect(clientOptions.autoReconnect).to.equal(true)
            expect(clientOptions.reconnectTries).to.equal(30)
            expect(clientOptions.reconnectInterval).to.equal(1000)
            expect(clientOptions.connectTimeoutMS).to.equal(200)
            expect(clientOptions.retryWrites).to.equal(true)
            expect(clientOptions.useNewUrlParser).to.equal(true)
        } catch (e) {
            console.log(e)

            expect(e).to.equal(null)
        } finally {
            await testClient.close()
        }
    })

    it("Database handle created from MongoClient", async () => {

        let testClient
        try {
            testClient = await MongoClient.connect(
                MONGO_URI,
                {
                    replicaSet: MONGO_RS_NAME,                              //nombre del replica set
                    //maxPoolSize: 100,                            //numero de conexiones para el pool creado
                    w: 1,                                        //confirmación de inserción en un solo nodo
                    wtimeout: 2000,                              //tiempo máximo para la insercion
                    readPreference: 'primaryPreferred',          //preferencia del nodo de lectura
                    autoReconnect: true,                         //reconectarse a la BD
                    reconnectTries: 30,                          //Intentos de reconeccion
                    reconnectInterval: 1000,                     //Intervalo de reconeccion
                    connectTimeoutMS: 200,
                    retryWrites: true,                           // reintento de escritura (solo uno)
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })

            // create a database object for the "test" database
            const testDB = testClient.db(MONGO_DATABASE)

            // make sure the "test" database has the correct collections
            const testCollections = await testDB.listCollections().toArray()
            const actualCollectionNames = testCollections.map(obj => obj.name)
            const expectedCollectionNames = ["addresses", "users","actions"]

            expectedCollectionNames.map(collection => expect(actualCollectionNames).to.contains(collection))
        } catch (e) {
            expect(e).to.equal(null)
        } finally {
            await testClient.close()
        }
    })

})
