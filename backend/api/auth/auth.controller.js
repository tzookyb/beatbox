
const authService = require('./auth.service')
const logger = require('../../services/logger.service');

async function login(req, res) {
    const credentials = req.body;
    try {
        const user = await authService.login(credentials)
        req.session.user = user;
        res.json(user)
    } catch (err) {
        res.status(401).send({ msg: 'Wrong username/password' })
    }
}

async function signup(req, res) {
    try {
        const { username, fullName, password, imgUrl } = req.body
        const account = await authService.signup(username, fullName, password, imgUrl)
        const credentials = { username, fullName, password, imgUrl };
        const user = await authService.login(credentials);
        req.session.user = user
        res.json(user)
    } catch (err) {
        logger.error('[SIGNUP] ' + err)
        res.status(500).send({ error: 'could not signup, please try later' })
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

module.exports = {
    login,
    signup,
    logout
}
