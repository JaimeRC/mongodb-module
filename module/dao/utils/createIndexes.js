/**
 * Crea indices si no existen en la Coleccion
 *
 * @param collection        Coneccion a la collecion.
 * @param indexes           Indices a aplicar.
 * @param opts              Opciones para aplicar en los indices
 */

module.exports = async (collection, indexes, opts) => {
    try {
        for (let index of indexes) {
            await collection.createIndexes(index, opts)
        }
    } catch (e) {
        console.error('CREATE INDEX -->', e.message)
    }
}
