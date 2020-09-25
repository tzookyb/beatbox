const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const bcrypt = require('bcryptjs')

const saltRounds = 10

async function login(credentials) {
    const { username, password } = credentials;
    if (!username || !password) return Promise.reject('username and password are required!')
    const user = await userService.getByName(username);
    if (!user) return Promise.reject('Invalid email or password');
    const match = (await bcrypt.compare(password, user.password));
    if (!match) return Promise.reject('Invalid username or password')
    delete user.password;
    return user;
}

async function signup(username, fullName, password, imgUrl) {
    // logger.debug(`auth.service - signup with fullName: ${fullName}, username: ${username}`)
    if (!username || !fullName || !password) return Promise.reject('fullName, username and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullName , imgUrl})
}

module.exports = {
    signup,
    login
}

// const bcrypt = require('bcryptjs')
// const userService = require('../user/user.service')
// const logger = require('../../services/logger.service')

// const saltRounds = 10

// async function login(email, password) {
//     logger.debug(`auth.service - login with email: ${email}`)
//     if (!email || !password) return Promise.reject('email and password are required!')

//     const user = await userService.getByEmail(email)
//     if (!user) return Promise.reject('Invalid email or password')
//     const match = await bcrypt.compare(password, user.password)
//     if (!match) return Promise.reject('Invalid email or password')

//     delete user.password;
//     return user;
// }

// async function signup(email, password, username) {
//     logger.debug(`auth.service - signup with email: ${email}, username: ${username}`)
//     if (!email || !password || !username) return Promise.reject('email, username and password are required!')

//     const hash = await bcrypt.hash(password, saltRounds)
//     return userService.add({email, password: hash, username})
// }

// module.exports = {
//     signup,
//     login,
// }