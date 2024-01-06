const db = require('../config/config')

const Rol = {};
Rol.create = (idUsuario, idRol, creado, actualizado) =>{
    const sql = `INSERT INTO usuario_has_rol(
        id_usuario,
        id_rol,
        creado,
        actualizado)
        VALUES($1,$2,$3,$4)`;
        return db.none(sql,[
            idUsuario, 
            idRol, 
            new Date(),
            new Date()
        ]);
}

module.exports = Rol;