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
    collMod: 'address',
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "address", "location"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                address: {
                    bsonType: "object",
                    required: ["city"],
                    properties: {
                        street: {
                            bsonType: "string",
                            description: "must be a string if the field exists"
                        },
                        city: {
                            bsonType: "string",
                            "description": "must be a string and is required"
                        }
                    }
                },
                location: {
                    bsonType: "object",
                    required: ["type", "coordinates"],
                    properties: {
                        type: {
                            bsonType: "string",
                            enum: ["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon", "GeometryCollection"],
                            description: "must be a string that specifies the GeoJSON object type"
                        },
                        coordinates: {
                            bsonType: "array",
                            description: "must be an array with two double values, first longitude and second latitude"
                        }

                    }
                }
            }
        }
    },
    validationLevel:
        "moderate",
    validationAction:
        "warn"
}

