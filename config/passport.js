const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const Usuario = require('../models/usuario');
const Keys = require('./keys');

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = Keys.secretOrKey;
    passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
        Usuario.findById(jwt_payload._id).then((error, usuario)=>{
            if(error) return done(error, false);
            
            if(usuario) return done(null, usuario);
            else return done(null, false);
        })

    }))
}