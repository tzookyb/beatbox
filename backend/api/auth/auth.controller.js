const authService = require('./auth.service')
const logger = require('../../services/logger.service');

module.exports = {
    login,
    signup,
    logout
}

async function login(req, res) {
    const credentials = req.body;
    try {
        const user = await authService.login(credentials);
        req.session.user = user;
        res.json(user);
    } catch (err) {
        res.status(401).send(err);
    }
}

async function signup(req, res) {
    try {
        const newUser = req.body;
        await authService.signup(newUser)
        const user = await authService.login(newUser);
        req.session.user = user;
        res.json(user)
    } catch (err) {
        logger.error('[SIGNUP] ' + err)
        res.status(500).send({ error: 'Signup server error' })
    }
}

async function logout(req, res) {
    try {
        req.session.destroy()
        res.send({ message: 'logged out successfully' })
    } catch (err) {
        res.status(500).send({ error: err })
    }
}