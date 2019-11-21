# MongoDB Module

Modulo de conexión a la base de datos de Mongo utilizando el driver `mongodb`, incluyendo esquemas de validación y clases que facilita el acceso a los datos almacenados en las diferentes coleciones.

## Estructura del Proyecto

    index.js                      # Archivo de inicializacion y conexion a la DB
      ├───test                    # Archivos de Test
      ├───schemas                 # Esquemas de validación de los campos de cada colección
      └───dao                     # Clases de todas la colecciones para gestionar la información
           └───utils              # Utilidades comunes para todas las colecciones


## Descripción

Simulacion de tres colecciones de MongoDB con Schemas de validacion segun la documentacion de MongoDB.

## Testing

Para realizar el test de la conexion, schemas, crud y transacciones se necesita realizar lo siguiente:

- Instalar los paquetes `npm`:

        npm install --save

- En una terminal situada en el mismo directorio del modulo, inicializar el modulo `run-rs` con la version de MongoDB que queramos.

        run-rs --version 4.2.0
        
        Purging database...
        Running '/Users/jaimerc/WorkSpace/mongodb-module/node_modules/run-rs/4.2.0/mongod' [ 27017, 27018, 27019 ]
        Starting replica set...
        Started replica set on "mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=rs"
        Connected to oplog
    
Esto lo que realizara es una simulacion de un ReplicaSet de MongoDB, esto es importante ya que sin ello no se podria realizar el test de las Transacciones (solo validas para RS).

- En otra terminal, inicializamos los test:

        npm test
    
        > nx-mongodb@1.0.0 test /Users/jaimerc/WorkSpace/mongodb-module
        > DB_TEST=test URI_TEST=mongodb://localhost:27017,localhost:27018,localhost:27019 mocha ./test/index.js --timeout 15000 --exit
        
          Testing nx-mongodb
            User Test
              ✓ Create (54ms)
              ✓ Read
              ✓ Update
              ✓ Delete
            Address Test
              ✓ Create (150ms)
              ✓ Read
              ✓ Update
              ✓ Delete
            MongoClient testing
              ✓ Client initialized with URI and options
              ✓ Database handle created from MongoClient
            Transactions Test
              ✓ createUserWithAddress
        
          11 passing (445ms)

    
