const {MongoClient} = require('mongodb')

describe('Testing nx-mongodb', () => {

    before(async () => {
        global.nixi1Client = await MongoClient.connect(
            process.env.URI_TEST,
            {
                replicaSet: '',                              //nombre del replica set
                maxPoolSize: 100,                            //numero de conexiones para el pool creado
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
    })

    after(async () => {
        await global.nixi1Client.db(process.env.DB_TEST).dropDatabase()
        await global.nixi1Client.close()
        delete global.nixi1Client
    })


    require('./user.test')

    require('./address.test')

    require('./mongoClient.test')

    require('./transaction.test')



})
