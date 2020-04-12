const {MongoClient} = require('mongodb')
const {env: {MONGO_RS_NAME, MONGO_URI}} = process
const collections = require('./dao')
const schemas = require('./schemas')


const options = {
    replicaSet: MONGO_RS_NAME,                   //nombre del replica set
    //maxPoolSize: 100,                          //numero de conexiones para el pool creado
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

MongoClient.connect(MONGO_URI, options)
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {

        //Aplicamos los Schemas de validacion
        await schemas.injectDB(client)

        //Injectamos la conexion a todas las colleciones para su uso
        await Object.keys(collections)
            .forEach(async collection => await collections[collection].injectDB(client))

    })
    .then(() => {
        console.log(`MongoDB connected a ${MONGO_URI}`)
        module.exports = collections
    })

