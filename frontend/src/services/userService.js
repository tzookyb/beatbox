import httpService from './httpService'
const STORAGE_KEY = 'loggedinUser'

export const userService = {
    login,
    signup,
    logout,
    // getUsers,
    getUser,
    getMinimalUser,
    addBox,
}

async function addBox(box) {
    const user = getUser();
    if (!user.boxes) user.boxes = [];
    user.boxes.push(box);
    return await httpService.put(`user/${user._id}`, user)
}

async function login(userCred) {
    const res = await httpService.post(`auth/login`, userCred);
    return _handleLoggedinUser(res);
}

async function logout() {
    await httpService.post(`auth/logout`);
    const user = _getGuestMode();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

async function signup(userCred) {
    const res = await httpService.post(`auth/signup`, userCred);
    return _handleLoggedinUser(res);
}

function getUser() {
    let user = _loadUser();
    if (!user) {
        user = _getGuestMode();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        // const res = await httpService.post(`user`, user);
    }
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

function _getGuestMode() {
    return {
        username: 'Guest',
        fullName: 'New Guest',
        imgUrl: '',
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

function _handleLoggedinUser(user) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user;
}

function _loadUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
}



// async function getUsers() {
//     return httpService.get(`user`);
// }




// function login(userCard) {
//     userCard._id = _makeId();
//     sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userCard))
// }

// function getUser() {
//     var user = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
//     if (!user) user = getGuestMode();
//     sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
//     // return getGuestMode();
//     return user;
// }
