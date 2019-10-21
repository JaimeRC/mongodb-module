# MongoDB Module

Modulo de conexión a la base de datos de Mongo utilizando el driver `mongodb`, incluyendo esquemas de validación y clases que facilita el acceso a los datos almacenados en las diferentes coleciones.

## Estructura del Proyecto

    index.js                      # Archivo de inicializacion y conexion a la DB
      ├───test                    # Archivos de Test
      ├───schemas                 # Esquemas de validación de los campos de cada colección
      └───dao                     # Clases de todas la colecciones para gestionar la información
           └───utils              # Utilidades comunes para todas las colecciones
