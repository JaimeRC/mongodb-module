const {MongoClient} = require('mongodb')
const {env: {MONGO_RS_NAME, MONGO_URI,MONGO_DATABASE}} = process

describe('Testing nx-mongodb', () => {

    before(async () => {
        global.testClient = await MongoClient.connect(
            MONGO_URI,
            {
                replicaSet: MONGO_RS_NAME,                   // Nombre del replica set
                //maxPoolSize: 100,                          // Numero de conexiones para el pool creado
                w: 1,                                        // Confirmación de inserción en un solo nodo
                wtimeout: 2000,                              // Tiempo máximo para la insercion
                readPreference: 'primaryPreferred',          // Preferencia del nodo de lectura
                autoReconnect: true,                         // Reconectarse a la BD
                reconnectTries: 30,                          // Intentos de reconeccion
                reconnectInterval: 1000,                     // Intervalo de reconeccion
                connectTimeoutMS: 200,
                //retryWrites: true,                         // Reintento de escritura (solo uno)
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        await global.testClient.db(MONGO_DATABASE).dropDatabase()
    })

    // Wait 1 seconds for earch test
    beforeEach(done => setTimeout(done, 1000));

    after(async () => {
        //await global.testClient.db(MONGO_DATABASE).dropDatabase()
        await global.testClient.close()
        delete global.testClient
    })


    require('./user.test')

    require('./address.test')

    require('./transaction.test')

    require('./actions.test')

    require('./mongoClient.test')

})
