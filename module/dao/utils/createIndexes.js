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
            const result = await collection.createIndexes(index, opts)

            console.log('CREATE INDEX -->', JSON.stringify(result))
        }
    } catch (e) {
        console.error('CREATE INDEX -->', e.message)
    }
}
