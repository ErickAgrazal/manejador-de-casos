const express = require('express');
const { Users } = require('../../models');
const { handleError } = require('../../helpers/error');

const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        const addedUser = await Users.add(req.body);
        res.json({ message: `Agregado usuario ${ addedUser.data.email }.`,  ...addedUser});
    } catch (error) {
        handleError({ statusCode: 404, message: String(error) }, res);
    }
});

router.post('/login', async (req, res) => {
    try {
        const jwtPayload = await Users.login(req.body);
        res.json(jwtPayload);
    } catch (error) {
        handleError({ statusCode: 404, message: String(error) }, res);
    }
});

module.exports = (app) => {
    app.use('/api/v1/auth', router);
}