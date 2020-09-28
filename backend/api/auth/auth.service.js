const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const bcrypt = require('bcryptjs')

const saltRounds = 10

async function login(credentials) {
    const { username, password } = credentials;
    if (!username || !password) return Promise.reject('username and password are required!')
    const user = await userService.getByName(username);
    if (!user) return Promise.reject('Invalid username or password');
    const match = (await bcrypt.compare(password, user.password));
    if (!match) return Promise.reject('Invalid username or password')
    delete user.password;
    return user;
}

async function signup(username, fullName, password, imgUrl) {
    // logger.debug(`auth.service - signup with fullName: ${fullName}, username: ${username}`)
    if (!username || !fullName || !password) return Promise.reject('fullName, username and password are required!');
    const hash = await bcrypt.hash(password, saltRounds);
    const user = await userService.getByName(username);
    if (user) return Promise.reject('username is already in use!'); 
    return userService.add({ username, password: hash, fullName , imgUrl})
}

module.exports = {
    signup,
    login
}
