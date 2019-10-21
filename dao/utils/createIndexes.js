/**
 * Crea indices si no existen en la Coleccion
 *
 * @param collection        Coneccion a la collecion.
 * @param indexes           Indices a aplicar.
 */

module.exports = async (collection, indexes) => {

    const indexesDB = await collection.getIndexes()

    if (!indexesDB.length && indexes.length)
        await collection.createIndexes(indexes, {})
}
