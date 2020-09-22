// import httpService from './httpService'
// const BASE_URL = 'http://localhost:3030/user'
const STORAGE_KEY = 'loggedinUser'

export const userService = {
    login,
    getUser,
    getMinimalUser
    // signup,
    // logout,
    // getUsers,
    // getUser
}

function login(userCard) {
    userCard._id = _makeId();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userCard))
}

function getUser() {
    var user = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (!user) user = getGuestMode();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    // return getGuestMode();
    return user;
}

function getMinimalUser() {
    var user = getUser();
    return {
        name: user.username,
        imgUrl: user.imgUrl,
        id: user._id
    }
}

function getGuestMode() {
    return {
        username: 'Guest',
        fullName: 'Best Guest',
        imgUrl: 'https://res.cloudinary.com/daqs7x8my/image/upload/v1600683124/ko8ia4xof4zz3yspbgoc.png',
        _id: _makeId()
    }
}

function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}
// function getUser() {
//     return axios.get(`${BASE_URL}`)
//         .then(res => res.data)
// }

// async function login(userCred) {
//     const res = await httpService.post(`auth/login`, userCred)
//     return _handleLoggedinUser(res)
// }

// function getUser() {
//     return _loadUser();
// }

// async function getUsers() {
//     return httpService.get(`user`);
// }

// async function login(userCred) {
//     const res = await httpService.post(`auth/login`, userCred)
//     return _handleLoggedinUser(res)
// }

// async function logout() {
//     await httpService.post(`auth/logout`)
//     sessionStorage.clear();
// }

// async function signup(userCred) {
//     const res = await httpService.post(`auth/signup`, userCred)
//     return _handleLoggedinUser(res)
// }

// function _handleLoggedinUser(user) {
//     sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
//     return user;
// }

// function _loadUser() {
//     return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
// }