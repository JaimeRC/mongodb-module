const {MongoClient} = require('mongodb')

describe('Testing nx-mongodb', () => {

    before(async () => {
        global.testClient = await MongoClient.connect(
            process.env.URI_TEST,
            {
                replicaSet: '',                              // Nombre del replica set
                maxPoolSize: 100,                            // Numero de conexiones para el pool creado
                w: 1,                                        // Confirmación de inserción en un solo nodo
                wtimeout: 2000,                              // Tiempo máximo para la insercion
                readPreference: 'primaryPreferred',          // Preferencia del nodo de lectura
                autoReconnect: true,                         // Reconectarse a la BD
                reconnectTries: 30,                          // Intentos de reconeccion
                reconnectInterval: 1000,                     // Intervalo de reconeccion
                connectTimeoutMS: 200,
                retryWrites: true,                           // Reintento de escritura (solo uno)
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
    })

    after(async () => {
        await global.testClient.db(process.env.DB_TEST).dropDatabase()
        await global.testClient.close()
        delete global.testClient
    })


    require('./user.test')

    require('./address.test')

    require('./mongoClient.test')

    require('./transaction.test')



})
