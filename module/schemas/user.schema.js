/**
 * Schema de validacion para la colecciòn User
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
    collMod: 'users',
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "year", "major", "address"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                year: {
                    bsonType: "int",
                    minimum: 2017,
                    maximum: 3017,
                    description: "must be an integer in [ 2017, 3017 ] and is required"
                },
                major: {
                    enum: ["Math", "English", "Computer Science", "History", null],
                    description: "can only be one of the enum values and is required"
                },
                gpa: {
                    bsonType: ["double"],
                    description: "must be a double if the field exists"
                },
                address: {
                    bsonType: "objectId",
                    description: "must be a objectId and is required"
                }
            }
        }
    },
    validationLevel: "moderate",
    validationAction: "warn"
}


