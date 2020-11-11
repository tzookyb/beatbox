import httpService from './httpService'
import { boxService } from './boxService';
import { utilService } from './utilService';

const STORAGE_KEY = 'loggedinUser'

export const userService = {
    login,
    signup,
    logout,
    getLoggedUser,
    getMiniUser,
    addBoxToUser,
    getUserBoxes,
    getUserById,
    removeBoxFromUser,
    toggleFavorite,
    getUserFavoriteBoxes,
}

async function login(userCerd) {
    const res = await httpService.post(`auth/login`, userCerd);
    return _saveLoggedinUser(res);
}

async function logout() {
    await httpService.post(`auth/logout`);
    let user = _getGuestMode();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

async function signup(userDetails) {
    userDetails = { ...userDetails, createdBoxes: [], favoriteBoxes: [], isGuest: false }
    const newUser = await httpService.post(`auth/signup`, userDetails);
    return _saveLoggedinUser(newUser);
}

function getMiniUser() {
    var user = getLoggedUser();
    return {
        name: user.username,
        imgUrl: user.imgUrl,
        id: user._id
    }
}

function _getGuestMode() {
    return {
        _id: utilService.makeId(5),
        username: 'Guest',
        imgUrl: '',
        isGuest: true,
        createdBoxes: [],
        favoriteBoxes: [],
    }
}

function _saveLoggedinUser(user) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user;
}

async function getUserById(userId) {
    return httpService.get(`user/${userId}`);
}

async function addBoxToUser(boxId) {
    const user = getLoggedUser();
    if (user.isGuest) return;
    const userId = user._id;
    const userFromDb = await getUserById(userId);
    if (!userFromDb.boxes) userFromDb.boxes = [];
    userFromDb.boxes.push(boxId);
    return await httpService.put(`user/${user._id}`, userFromDb)
}

async function removeBoxFromUser(boxId) {
    const user = getLoggedUser();
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

async function toggleFavorite(boxId) {
    const user = getLoggedUser();

    const idx = user.favoriteBoxes.findIndex(box => box === boxId);
    if (idx === -1) user.favoriteBoxes.push(boxId);
    else user.favoriteBoxes.splice(idx, 1);

    const updatedUser = await httpService.put(`user/${user._id}`, user);
    _saveLoggedinUser(updatedUser);
    return updatedUser;
}

function getLoggedUser() {
    let user = _loadUser();
    if (!user) {
        user = _getGuestMode();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    return user;
}

function _loadUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
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