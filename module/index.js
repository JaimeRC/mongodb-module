const {MongoClient} = require('mongodb')
const {env: {MONGO_RS_NAME, MONGO_URI}} = process
const collections = require('./dao')
const schemas = require('./schemas')

/**
 * Opciones para el pool de conexiones
 * @typedef {Object} options
 * @property {string} replicaSet            Nombre del replica set
 * @property {number} maxPoolSize           Numero de conexiones para el pool creado
 * @property {number} w                     Confirmación de inserción en un solo nodo
 * @property {number} wtimeout              Tiempo máximo para la insercion
 * @property {string} readPreference        Preferencia del nodo de lectura
 * @property {boolean} autoReconnect        Reconectarse a la BD
 * @property {number} reconnectTries        Intentos de reconeccion
 * @property {number} reconnectInterval     Intervalo de reconeccion
 * @property {number} connectTimeoutMS
 * @property {boolean} retryWrites          Reintento de escritura (solo uno)
 * @property {boolean} useNewUrlParser
 * @property {boolean} useUnifiedTopology
 */
const options = {
    replicaSet: MONGO_RS_NAME,
    //maxPoolSize: 100,
    w: 1,
    wtimeout: 2000,
    readPreference: 'primaryPreferred',
    autoReconnect: true,
    reconnectTries: 30,
    reconnectInterval: 1000,
    connectTimeoutMS: 200,
    retryWrites: true,
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

