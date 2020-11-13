/**
 * Crea indices si no existen en la Coleccion
 * @param {Collection} collection          Coneccion a la collecion.
 * @param {Array<object>} indexes          Indices a aplicar.
 */
module.exports = async (collection, indexes) => {
    try {
        for (let {name, key, opts} of indexes) {
            await collection.createIndex(key, {name, ...opts})
        }
    } catch (e) {
        console.error('CREATE INDEX -->', e.message)
    }
}
