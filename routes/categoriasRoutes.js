const CategoriasController = require('../controllers/categoriasController');

module.exports = (app) => {
    app.get('/api/categorias/getAll', CategoriasController.getAll);
}