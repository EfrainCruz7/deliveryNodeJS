const UsuariosController = require('../controllers/usuariosControllers');

module.exports = (app, upload) => {
    // GET es para traer datos de la API
    // POST es para crear datos en la API 
    app.get('/api/usuarios/getAll', UsuariosController.getAll);

    app.get('/api/usuarios/findByID/:id', UsuariosController.findByID);


    app.post('/api/usuarios/create', upload.array('image', 1), UsuariosController.registrarConImagen);

    app.post('/api/usuarios/create', UsuariosController.registrar);

    app.put('/api/usuarios/update', upload.array('image', 1), UsuariosController.updateDatos);


    app.post('/api/usuarios/login', UsuariosController.login);

    
}
