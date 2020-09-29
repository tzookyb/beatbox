import httpService from './httpService'
import { boxService } from './boxService';

const STORAGE_KEY = 'loggedinUser'

export const userService = {
    login,
    signup,
    logout,
    getUser,
    getMinimalUser,
    addBoxToUser,
    getUserBoxes,
    getUserById,
    removeBoxFromUser,
    toggleToFavorite,
    getUserFavoriteBoxes,
    isBoxFavorite
}

async function login(userCerd) {
    const res = await httpService.post(`auth/login`, userCerd);
    return _handleLoggedinUser(res);
}

async function logout() {
    await httpService.post(`auth/logout`);
    let user =  _getGuestMode();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    // sessionStorage.clear();
}

async function signup(userCerd) {
    const res = await httpService.post(`auth/signup`, userCerd);
    return _handleLoggedinUser(res);
}

function getUser() {
    let user = _loadUser();
    if (!user) {
        user = _getGuestMode();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
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
        isGuest: true,
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

async function getUserById(userId) {
    return httpService.get(`user/${userId}`);

}

async function addBoxToUser(boxId) {
    const user = getUser();
    if (user.isGuest) return;
    const userId = user._id;
    const userFromDb = await getUserById(userId);
    if (!userFromDb.boxes) userFromDb.boxes = [];
    userFromDb.boxes.push(boxId);
    return await httpService.put(`user/${user._id}`, userFromDb)
}

async function removeBoxFromUser(boxId) {
    const user = getUser();
    const userId = user._id;
    const userFromDb = await getUserById(userId);
    const newBoxes = userFromDb.boxes.filter(box => boxId !== box);
    userFromDb.boxes = newBoxes;
    return await httpService.put(`user/${user._id}`, userFromDb);
}

async function getUserBoxes(userId) {
    const userFromDb = await getUserById(userId);
    if (!userFromDb.boxes) return;
    const boxes = await Promise.all(userFromDb.boxes.map(async (boxId) => {
        const box = await boxService.getById(boxId);
        return box;
    }))
    return boxes;
}

async function toggleToFavorite(boxId) {
    const user = getUser();
    if (user.isGuest) return;
    const userId = user._id;
    const userFromDb = await getUserById(userId);
    if (!userFromDb.favoriteBoxes) {
        userFromDb.favoriteBoxes = [];
        userFromDb.favoriteBoxes.push(boxId);
    }
    else {
        const isFavoriteIdx = await userFromDb.favoriteBoxes.findIndex(box => box === boxId);
        if (isFavoriteIdx === -1) userFromDb.favoriteBoxes.push(boxId);
        else userFromDb.favoriteBoxes.splice(isFavoriteIdx, 1);
    }
    return await httpService.put(`user/${user._id}`, userFromDb);
}


async function getUserFavoriteBoxes(userId) {
    const userFromDb = await getUserById(userId);
    if (!userFromDb.favoriteBoxes) return;
    const boxes = await Promise.all(userFromDb.favoriteBoxes.map(async (boxId) => {
        const box = await boxService.getById(boxId);
        return box;
    }))
    return boxes;
}

async function isBoxFavorite(user, boxId) {
    if (user.isGuest) return false;
    const userFromDb = await getUserById(user._id);
    let isFavoriteIdx = -1;
    if (!userFromDb.favoriteBoxes) return false;
    isFavoriteIdx = await userFromDb.favoriteBoxes.findIndex(box => box === boxId)
    if(isFavoriteIdx === -1) return false;
    return true;
}
