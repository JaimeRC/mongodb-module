# MongoDB Module

## Descripción

Modulo de conexión a la base de datos de Mongo utilizando el driver `mongodb`, incluyendo esquemas de validación y clases que facilita el acceso a los datos almacenados en las diferentes colecciones. 
Ademas, para la utilización de este mismo se ha desarrollado con Docker la creación de un ReplicaSet de MongoDb.

## Estructura del Proyecto
    
    docker-compose.yml
        ├─── module
        |     ├───index.js                # Archivo de inicialización y conexión a la DB
        |     ├───test                    # Archivos de Test
        |     ├───schemas                 # Esquemas de validación de los campos de cada colección
        |     └───dao                     # Clases de todas la colecciones para gestionar la información
        |          └───utils              # Utilidades comunes para todas las colecciones
        └─── mongo
              ├───.env                    # Variables de Entornos para Docker-compose
              ├───config                  # Archivos de Configuración de cada Cluster de Mongo
              ├───data                    # Carpeta de almacenamiento de información para los CLuster de Mongo (No habilitado)
              |     ├───node1             # Cluster 1
              |     ├───node2             # Cluster 2
              |     └───node2             # Cluster 3
              └───deploy                  # Carpeta para la creación/iniciación del Cluster
                    ├───rs_initiate.js    # Inicialización del ReplicaSet de Mongo
                    └───setup.sh          # Comprueba que los Cluster de mongo están levantados y ejecuta la Configuración del ReplicaSet
     

## MongoDB
### Antes de empezar, hablemos un poco de la configuración de MongoDB

Para la creación de un ReplicaSet de tres clusters en Mongo lo que se ha realizado es crear 4 contenedores de Docker (`mongoclient`, `mongo1`, `mongo2` y `mongo3`). 
La diferencia del contenedor `mongoclient` respecto a los otros tres clusters es que este solo lo se encarga de inicializar el ReplicaSet y su configuración, después de esto es dado de baja.

### Configuración de los clusters del ReplicaSet (RS)

Para la configuración de cada cluster se ha realizado desde un archivo `.conf` el cual se indica al inicializar el contenedor de cada cluster (`mongod --config /etc/node1.conf`).

La configuración del primer cluster:

        storage:                                       # Configuración de almacenamiento
           dbPath: /data/db/node1                      # Ruta donde almacenar los datos
           journal:
              enabled: true                             # Diario de registro de transacciones binario secuencial que se usa para llevar la base de datos a un estado válido en caso de un cierre forzado
           engine: wiredTiger                           # Motor de almacenamiento
           wiredTiger:                                  
              engineConfig:
                 cacheSizeGB: 3.5                       # Limitación del motor de almacenamiento en 3.5 GB RAM (para este caso un ordenador de 8 GB RAM)
        net:
           bindIpAll: true                              # Blinda todas las direcciones ipv4
           port: 27010                                  # Puerto de escucha
        processManagement:
           fork: false                                  # Proceso en segundo plano
        systemLog:
           destination: file                            # Destino de almacenamiento de logs
           path: /data/db/node1/mongod.log              # Ruta de almacenamiento de información
           logAppend: true                              # Concatena los logs nuevos con los anteriores cuando se reinicia el cluster.
        replication:
           replSetName: rs_name                         # Nombre del ReplicaSet

***Nota:***
Para saber el tamaño de `cacheSizeGB` nos hemos basado de la siguiente formula suministrada por documentación de MongoDB `(0.5 * (TOTAL_RAM_MACHINE - 1 GB))`.
Ejemplo, si tenemos una maquina con 8GB de RAM seria `(0.5 * (8 - 1) = 3.5GB`

El resto de clusters tienen la misma configuración, solo se modifica las rutas de almacenamiento de datos y logs.

### Inicialización y configuración del RS

La inicialización y configuración es realizada por el cluster `mongoclient`, el cual se espera a que los clusters `mongo1`, `mongo2` y `mongo3` se inicialicen. 
Después de esto, lo que se realiza es el lanzamiento de un script en bash para la configuración:

        until mongo --host mongo1:27010 --eval "print(\"waited for connection\")"
        do
            sleep 10
        done
        mongo --host mongo1:27010 ./src/rs_initiate.js

Este script lo que hace es imprimir un logs (`waited for connection`) y al cabo de 10 segundo lanza el comando que se conecta al cluster `mongo1` 
para ejecutar el archivo de javascript de configuración:

        # Objeto con la configuración del RS (nombre y los host de los miembros)
        var rs_cluster = {
            _id: "rs_name",
            members: [
                {_id: 0, host: 'mongo1:27010'},
                {_id: 1, host: 'mongo2:27011'},
                {_id: 2, host: 'mongo3:27012'}
            ]
        };
        
        # Función que hace esperar la cantidad de milisegundos que se le pase
        var sleep = function (milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds){
                    break;
                }
            }
        };
        
        # Información del RS
        var replStatus = rs.status();
        
        # En el caso de que ya este configurado imprime la información
        if(replStatus && replStatus.ok === 1){
            print(" ### Replication OK");
            printjson(replStatus);
        
        # En el caso de que no este configurado, configuramos el RS e imprimimos su información.
        } else {
            print(" ### Starting replication...");
            printjson(rs.initiate(rs_cluster));
            sleep(5000);
            print(" ");
            print(" ### Replica Set status");
            printjson(rs.status());
        }

Después de que se ejecute este proceso, ya tendremos inicializado y configurado el RS.

Para conectarnos a este RS con el driver de MongoDB tendríamos que utilizar la siguiente uri: `mongodb://mongo1:27010,mongo2:27011,mongo3:27012`

## Prerequisitos

- [Docker](https://docs.docker.com/install/) 
- [Docker Compose](https://docs.docker.com/compose/install/)

## Empezando

1. Clona el repositorio.
2. Ejecuta el comando `docker-compose up`.

        Creating network "mongo_network" with driver "bridge"
        Pulling mongo1 (mongo:latest)...
        latest: Pulling from library/mongo
        5bed26d33875: Downloading [=======>                                           ]  4.135MB/26.69MB
        ...
        1d3609ce2ac9: Waiting
        ...
        Starting mongo1 ... done
        Starting mongo3 ... done
        Starting mongo2 ... done
        Starting mongoclient ... done
        Recreating module    ... done
        Attaching to mongo1, mongo3, mongo2, mongoclient, module

3. Despues de que se creen las instancia en los contenedores, nos introduciremos dento del contenedor de `module` para ejecutar los test:
       
       docker exec -it module sh 
       npm run test
       
        Testing nx-mongodb
           User Test
             ✓ Create
             ✓ Read
             ✓ Update
             ✓ Delete
           Address Test
             ✓ Create
             ✓ Read
             ✓ Update
             ✓ Delete
           Transactions Test
             ✓ createUserWithAddress
           Action Test
             ✓ Create
       [DAO - TRIGGER] -->  insert  -->  { _id: { _id: 5e92eec30b85930022b7b94d } }
             ✓ Read
             ✓ Update
       [DAO - TRIGGER] -->  update  -->  { _id: { _id: 5e92eec30b85930022b7b94d } }
             ✓ Delete
           Trigger Test
       [DAO - TRIGGER] -->  delete  -->  { _id: { _id: 5e92eec30b85930022b7b94d } }
             ✓ Create
       [DAO - TRIGGER] -->  insert  -->  { _id: 'test_1' }
             ✓ Read
             ✓ Update
       [DAO - TRIGGER] -->  update  -->  { _id: 'test_1' }
             ✓ Delete
       [DAO - TRIGGER] -->  delete  -->  { _id: 'test_1' }
       [DAO - TRIGGER] -->  insert  -->  { _id: 'test_2' }
             ✓ Expire Document (8007ms)
       [DAO - TRIGGER] -->  delete  -->  { _id: 'test_2' }
           MongoClient testing
             ✓ Client initialized with URI and options
             ✓ Database handle created from MongoClient
       
       
         20 passing (29s)


