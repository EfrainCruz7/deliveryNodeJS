const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const res = require('express/lib/response');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

//inicializar firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const upload = multer({
    storage: multer.memoryStorage()
})

/*RUTAS */
const categorias = require('./routes/categoriasRoutes');
const usuarios = require('./routes/usuariosRoutes');


const port = process.env.PORT || 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(cors());
//app.disable('x-powered-by');
app.set('port', port);

//Llamando a la ruta
categorias(app);
usuarios(app, upload);

const hostname = '192.168.1.2'; // Direccion IP del servidor
server.listen(port, hostname, function() {
    console.log('Efrain Delivery ' + process.pid + ' iniciada en http://' + hostname + ':' + port + '...');
});

app.get('/te', (req, res) => {
    res.send('Ruta TEST');
});

app.get('/dida', (req, res) => {
    res.send('Ruta raiz del backend');
});


//Manejo de errores

app.use((err,req,res,next) =>{
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

// Codigo 200 -> es repuesta exitosa
// Codigo 404 -> significa que la URL no existe

module.exports = {
    app: app,
    server: server
}













// biblioteca instala npm i crypto para encriptar la contraseña de los usuarios