/**
 * Crea indices si no existen en la Coleccion
 *
 * @param collection        Coneccion a la collecion.
 * @param indexes           Indices a aplicar.
 * @param opts              Opciones para aplicar en los indices
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
