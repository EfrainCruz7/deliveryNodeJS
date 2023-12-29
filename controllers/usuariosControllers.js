const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');
const { request } = require('http');
/* El await espera que finalize su tarea al traer los datos al data y recien
    salta a la siguiente linea de codigo*/


module.exports = {
    //trae todos los usuarios de la tabla Usuario de la base de datos
    async getAll(req, res , next){
        try{

            const data = await Usuario.getAll();
            console.log(`Usuarios: ${data}`)
            return res.status(200).json(data);
        }
        catch(error){
            console.log(`Usuarios: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los resultados'
            });
        }
    },

    async findByID(req, res , next){
        try{
            const id = req.params.id;
            console.log(id);
            const data = await Usuario.findByID(id);
            console.log(`Usuario: ${data}`)
            return res.status(200).json(data);
        }
        catch(error){
            console.log(`Usuario: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener el id del usuario'
            });
        }
    },


        //registra un nuevo usuario luego lo guarda en la tabla Usuario de la base de datos
    async registrar(req, res, next){
        try {
            const usuario = req.body;
            const data = await Usuario.create(usuario);
            await Rol.create(data.id,1)
            return res.status(201).json({
                success: true,
                message: 'Tu registro se realizo correctamente, Ahora inicia sesion',
                data: data.id
            });
        }
        catch(error)
        {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en el registro del nuevo usuario',
                error: error
            })
        }
    },

    async registrarConImagen(req, res, next){
        try {
            const usuario = JSON.parse(req.body.usuario);
            console.log(usuario)

            const files = req.files;
            if(!files || !files[0]) throw new Error('No hay archivos');
               else{
                const pathImage = `image_${Date.now()}`; // nombre del archivo
                const url = await storage(files[0], pathImage);
                    if(url != undefined && url != null)
                    {
                        usuario.imagen = url;
                    }
               } 

            const data = await Usuario.create(usuario);
            await Rol.create(data.id,1)
            return res.status(201).json({
                success: true,
                message: 'Tu registro se realizo correctamente, Ahora inicia sesion',
                data: data.id
            });
        }
        catch(error)
        {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en el registro del nuevo usuario',
                error: error
            })
        }
    },

  

    async updateDatos(req, res, next){
        try {
            const usuario = JSON.parse(req.body.usuario);
            console.log(usuario);

            const files = req.files;
            if(!files || !files[0]) throw new Error('No hay archivos');
               else{
                const pathImage = `image_${Date.now()}`; // nombre del archivo
                const url = await storage(files[0], pathImage);
                    if(url != undefined && url != null)
                    {
                        usuario.imagen = url;
                    }
               } 

            Usuario.update(usuario);
            console.log(usuario);
            return res.status(201).json({
                success: true,
                message: 'Datos actualizados correctamente',
            });
        }
        catch(error)
        {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error en la actualizacion de datos',
                error: error
            })
        }
    },

    // verifica el email y la contraseña ingresados con nuestra base de datos para loguearse como usuario
    async login(req, res, next) {
        try {
            const email = req.body.email;
            const contrasenia = req.body.contrasenia;
            const miUsuario = await Usuario.findByEmail(email);

    
            if (!miUsuario) {
                return res.status(401).json({
                    success: false,
                    message: 'El email no fue encontrado'
                });
            }
    
            const contraseniaValida = await bcrypt.compare(contrasenia, miUsuario.contrasenia);
            console.log(contraseniaValida);
            if (contraseniaValida) {
                const token = jwt.sign({ id: miUsuario.id, email: miUsuario.email }, keys.secretOrKey, {
                    // expiresIn: 60 * 60 * 24, // 1 Hora
                });
    
                const data = {
                    id: miUsuario.id,
                    nombre: miUsuario.nombre,
                    aPaterno: miUsuario.apaterno,
                    aMaterno: miUsuario.amaterno,
                    imagen: miUsuario.imagen,
                    email: miUsuario.email,
                    telefono: miUsuario.telefono,
                    fechaNacimiento: miUsuario.fechanacimiento,
                    sesionToken: `JWT ${token}`,
                    roles : miUsuario.roles
                };
                console.log(data)
    
                return res.status(201).json({
                    success: true,
                    data: data,
                    message: 'Autenticación exitosa'
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta'
                });
            }
        } catch (error) {
            console.error(`Error: ${error}`);
            next(error);
        }
    }
  
}