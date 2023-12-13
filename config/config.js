// este archivo config.js es la configuracion para conectarnos a la base de datos de Postgresql


// La biblioteca bluebird se almacena en la constante promise
const promise = require('bluebird');
const options = {
    promiseLib: promise,
    query: (e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function(stringValue){
    return stringValue;
});

// contiene los parametros de coneccion a postgresql y asi acceder a la base de datos en un objeto databaseConfig
const databaseConfig = {
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'delivery_db',
    'user': 'postgres',
    'password': '123456789',
};

/* pg-promise(pgp) es una biblioteca para Node.js que proporciona una interfaz más fácil y segura para trabajar con bases de datos PostgreSQL.
 Facilita la gestión de conexiones, la escritura de consultas y la ejecución de transacciones.*/
const db = pgp(databaseConfig);


// module.exports permite usar db en otros archivos externos dentro de nuestro backend
module.exports = db;