const { Users } = require('../models'); 


const authenticationRequired = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const jwtPayload = authHeader.split(' ')[1];
        const { tokenValid, email } = Users.verifyJWT({ jwtPayload });
        if (tokenValid !== true){ res.sendStatus(403); return; }
        try {
            const user = await Users.findOne({ email });
            req.user = user;
            next();
        } catch (error) {
            console.log('Error authenticating the user. Original error: ', error);
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    authenticationRequired
}