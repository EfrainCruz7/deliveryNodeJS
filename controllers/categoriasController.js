const Categoria = require('../models/categoria');

module.exports = {
    async getAll(req, res , next){
        try{
            const data = await Categoria.getAll();
            console.log(`Categorias: ${data}`)
            return res.status(200).json(data);
        }
        catch(error){
            console.log(`Categorias: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los resultados'
            });
        }
    }
}