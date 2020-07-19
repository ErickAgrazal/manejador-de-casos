const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { SECRET='+/:7kXGCksx."(Aps&bvP<7BuS.@NP"w' } = process.env;

const UserSchema = new mongoose.Schema({
    email: {
        unique: true,
        type: String,
        lowercase: true,
        required: [true, "no puede estar vacío"],
        match: [/\S+@\S+\.\S+/, 'es inválido'], 
        index: true
    },
    bio: String,
    image: String,
    hash: String,
    salt: String,
    active: { 
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

UserSchema.plugin(mongooseUniqueValidator, { message: 'ya fue tomado.' })


/**
 * setPassword: Configura la contraseña a la instancia del modelo.
 * @param {string} password 
 */
UserSchema.methods.setPassword = (user, password, passwordVerify) => {
    // TODO: Refactor the error handling, to standarize it.
    const passwordSettings = { minSize: 8 }
    if (password !== passwordVerify){
        throw new Error('Falló la verificación de las contraseñas.');
    }
    if (password.length < passwordSettings.minSize){
        throw new Error(`La contraseña debe tener al menos ${passwordSettings.minSize} caracteres.`);
    }
    user.salt = crypto.randomBytes(16).toString('hex');
    user.hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
};

/**
 * validPassword: Valida que una contraseña recibida es la que corresponde a
 *                la de la instancia que se está revisando.
 * @param {string} password 
 */
UserSchema.methods.validPassword = (user, password) => {
    const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
    return user.hash === hash;
};

/**
 * generateJWT: Genera un token JWT para una instancia del modelo.
 */
UserSchema.methods.generateJWT = (user) => {
    // TODO: Refactor to use PassportJS
    const today = new Date();
    const exp = new Date(today);
    // 60 días
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        email: user.email,
        exp: parseInt(exp.getTime() / 1000),
    }, SECRET);
};

/**
 * Retorna representación en json del usuario autenticado
 */
UserSchema.methods.toAuthJSON = (user) => {
  return {
    email: user.email,
    token: user.generateJWT(user),
    bio: user.bio,
    image: user.image
  };
};

/**
 * Retorna el usuario, si la función pudo crear el usuario.
 * @param {*} param0 
 */
UserSchema.statics.add = async({ email, bio, image, password, passwordVerify }) => {
    const user = await User({ email, bio, image });
    user.setPassword(user, password, passwordVerify);
    await user.save();
    return { data: { email, bio, image } };
}

/**
 * Retorna una lista de usuarios.
 */
UserSchema.statics.getItems = async () => {
    const users = await User.find().select('email bio image');
    return { count: users.length, data: users };
};

/**
 * Autentica a un usuario.
 */
UserSchema.statics.login = async({ email, password }) => {
    // TODO: Refactor, implement PassportJS
    const user = await User.findOne({ email });
    const validPassword = user.validPassword(user, password);
    if (validPassword !== true){
        throw new Error("El correo o la contraseña no son válidas.");
    }
    return user.toAuthJSON(user);
}

/**
 * Verifica que el JWT sea válido
 */
UserSchema.statics.verifyJWT = ({ jwtPayload }) => {
    const jwtPayloadDecoded = jwt.decode(jwtPayload, { key: SECRET });
    if (!jwtPayloadDecoded){
        throw new Error('El token de autenticación es inválido.')
    }
    const now = Date.now();
    if (now - jwtPayloadDecoded.iat < 0){
        throw new Error('El token de autenticación ya expiró.');
    }
    return { tokenValid: true, email: jwtPayloadDecoded.email };
}

const User = mongoose.model('User', UserSchema);

module.exports = User;