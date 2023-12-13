const UsuariosController = require('../controllers/usuariosControllers');

module.exports = (app, upload) => {
    // GET es para traer datos de la API
    // POST es para crear datos en la API 
    app.get('/api/usuarios/getAll', UsuariosController.getAll);

    app.post('/api/usuarios/create', upload.array('image', 1), UsuariosController.registrarConImagen);

    app.post('/api/usuarios/create', UsuariosController.registrar);

    app.post('/api/usuarios/login', UsuariosController.login);
}
