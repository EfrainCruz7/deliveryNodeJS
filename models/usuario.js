// Importar el módulo de la base de datos
// llamar al pgp db para acceder a la base de datos
//const { callbackify } = require('util');
const db = require('../config/config');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

//hace la consulta a la base de datos y trae todos los usuarios
const Usuario = {};
Usuario.getAll = () => {
    const sql = `SELECT * FROM Usuario`;
    return db.manyOrNone(sql);
}

//Crea un nuevo usuario en la base de datos

Usuario.create = (usuario) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(usuario.contrasenia, 10, (err, hash) => {
            if (err) {
                console.error('Error al generar el hash de la contraseña:', err);
                reject(err); // Rechazar la promesa en caso de error
            } else {
                console.log('Hash de contraseña seguro:', hash);
                usuario.contrasenia = hash; // Actualiza la contraseña del usuario con el hash
                usuario.isActivo = true;

                const sql = `INSERT INTO usuario (
                    nombre,
                    apellido_paterno,
                    apellido_materno,
                    imagen,
                    email,
                    telefono,
                    contrasenia,
                    fecha_nacimiento,
                    is_activo,
                    sesion_token,
                    creado,
                    actualizado)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`;

                    db.oneOrNone(sql, [
                    usuario.nombre,
                    usuario.aPaterno,
                    usuario.aMaterno,
                    usuario.imagen,
                    usuario.email,
                    usuario.telefono,
                    usuario.contrasenia,
                    usuario.fechaNacimiento,
                    usuario.isActivo,
                    usuario.sesionToken,
                    new Date(),
                    new Date()
                ])
                .then(data => resolve(data))
                .catch(error => reject(error));
            }
        });
    });
}

Usuario.update = (usuario) => {
    try {
        const sql =`
        UPDATE Usuario SET
            nombre = $2,
            apellido_paterno = $3,
            apellido_materno = $4,
            imagen = $5,
            telefono = $6,
            fecha_nacimiento = $7,
            actualizado = $8
        WHERE id = $1`;

        db.none(sql, [
            usuario.id,
            usuario.nombre,
            usuario.aPaterno,
            usuario.aMaterno,
            usuario.imagen,
            usuario.telefono,
            usuario.fechaNacimiento,
            new Date()
        ])
        .then(() => {
            console.log('Actualizacion exitosa:', usuario);
        })
        .catch(error => {
            console.error('Error en la actualizacion:', error);
        });

    } catch (error) {
        console.error('Error en el Usuario.metodo actualizacion:', error);
    }
};

Usuario.updateToken = (id, token) => {
    try {
        const sql = `
            UPDATE Usuario SET
               sesion_token =$2
            WHERE id = $1`;

            db.none(sql, [
            id,
            token
        ])
        .then(() => {
            console.log('Actualizacion exitosa:', token);
        })
        .catch(error => {
            console.error('Error en la actualizacion:', error);
        });

    } catch (error) {
        console.error('Error en el Usuario.metodo actualizacion:', error);
    }
};

Usuario.findByID = (id) => {
    const sql = `SELECT 
    U.id,
    U.nombre,
    U.apellido_paterno,
    U.apellido_materno,
    U.imagen,
    U.email,
    U.telefono,
    U.contrasenia,
    TO_CHAR(U.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento,
    U.sesion_token,
	json_agg(
		json_build_object(
		'id', R.id,
		'nombre', R.nombre,
		'imagen', R.imagen,
		'ruta', R.ruta
		)
	) AS roles
	
    FROM
        Usuario AS U
	INNER JOIN
		usuario_has_rol AS UHR
	ON
		UHR.id_usuario = U.id
	INNER JOIN
		rol AS R
	ON
		R.id = UHR.id_rol
    WHERE
        U.id = $1
	GROUP BY U.id
`;
    return db.oneOrNone(sql, id);
}


Usuario.findByEmail = (email) => {
    const sql = `SELECT 
    U.id,
    U.nombre,
    U.apellido_paterno,
    U.apellido_materno,
    U.imagen,
    U.email,
    U.telefono,
    U.contrasenia,
    TO_CHAR(U.fecha_nacimiento, 'YYYY-MM-DD') AS fecha_nacimiento,
    U.sesion_token,
	json_agg(
		json_build_object(
		'id', R.id,
		'nombre', R.nombre,
		'imagen', R.imagen,
		'ruta', R.ruta
		)
	) AS roles
	
    FROM
        Usuario AS U
	INNER JOIN
		usuario_has_rol AS UHR
	ON
		UHR.id_usuario = U.id
	INNER JOIN
		rol AS R
	ON
		R.id = UHR.id_rol
    WHERE
        U.email = $1
	GROUP BY U.id
`;
    return db.oneOrNone(sql, email);
}



module.exports = Usuario;

/*
    importar paquetes JWT
     npm i passport 
     npm i passport-jwt
*/
