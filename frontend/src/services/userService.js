import httpService from './httpService'
import { utilService } from './utilService';

const STORAGE_KEY = 'loggedinUser'

export const userService = {
    login,
    signup,
    logout,
    getLoggedUser,
    getMiniUser,
    addBoxToUser,
    getUserById,
    removeBoxFromUser,
    toggleFavorite,
}

function getLoggedUser() {
    let user = _loadUser();
    if (!user) {
        user = _getGuestMode();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    return user;
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

async function login(userCred) {
    try {
        const res = await httpService.post(`auth/login`, userCred);
        return _saveLoggedinUser(res);
    } catch (error) {
        throw error;
    }

}

async function logout() {
    await httpService.post(`auth/logout`);
    let user = _getGuestMode();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

async function signup(userDetails) {
    userDetails = { ...userDetails, createdBoxes: [], favoriteBoxes: [], isGuest: false }
    try {
        const newUser = await httpService.post(`auth/signup`, userDetails);
        return _saveLoggedinUser(newUser);
    } catch (error) {
        throw error;
    }
}

function getMiniUser() {
    var user = getLoggedUser();
    return {
        name: user.username,
        imgUrl: user.imgUrl,
        id: user._id
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
    const updatedUser = await getUserById(user._id);
    updatedUser.createdBoxes.push(boxId);
    _saveLoggedinUser(updatedUser);
    return await httpService.put(`user/${user._id}`, updatedUser)
}

async function removeBoxFromUser(boxId) {
    const user = getLoggedUser();
    const updatedUser = await getUserById(user._id);
    updatedUser.createdBoxes = updatedUser.createdBoxes.filter(box => boxId !== box);
    _saveLoggedinUser(updatedUser);
    return await httpService.put(`user/${user._id}`, updatedUser);
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

function _loadUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
}