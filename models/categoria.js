const db = require('../config/config');

const Categoria = {};
Categoria.getAll = () => {
    const sql = `SELECT * FROM Categoria`;

    return db.manyOrNone(sql);
}

module.exports = Categoria;