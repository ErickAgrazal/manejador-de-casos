const express = require('express');
const { Users } = require('../../models');
const { authenticationRequired } = require('../../helpers/authentication');

const router = express.Router();

router.get('/', authenticationRequired, async (req, res) => {
    const users = await Users.getItems();
    res.json(users);
});

module.exports = (app) => {
    app.use('/api/v1/users', router);
}