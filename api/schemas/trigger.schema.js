/**
 * Schema de validacion para la colecciòn Trigger
 *
 * @type {{collMod: string, validationLevel: string, validator: object, validationAction: string}}
 *
 * @param {string} collMod                              Nombre de la coleccion
 * @param {object} validator                            Objecto de $jsonSchema con los campos a validar
 * @param {string} validator.$jsonSchema.bsonType       Tipo de objeto
 * @param {array} validator.$jsonSchema.required        Campos requeridos
 * @param {object} validator.$jsonSchema.properties     Propiedades definidas por cada campo
 * @param {object} validator.$jsonSchema                Esquema de validación
 * @param {string} validationLevel                      Nivel de validaciòn:
 *                                                          - off: no se aplica las validaciones indicadas.
 *                                                          - strict: aplica todas las validaciones en todos los inserts y updates (default)
 *                                                          - moderated: aplica las validaciones en los campos existentes. No valida los campos ignorados.
 * @param {string} validationAction                     Accion al validar:
 *                                                          - error: El documento debe pasar la validacion en orden que esta siendo escrito.
 *                                                          - warn: El documento que no pase la validacion será guardado pero con un mensage de alerta.
 */

module.exports = {
    collMod: 'trigger',
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["expireAt"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "must be a ObjectID of an action and is required"
                },
                expireAt: {
                    bsonType: "date",
                    description: "must be a date greater than now and is required"
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "warn"
}


