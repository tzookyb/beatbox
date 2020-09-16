import httpService from './httpService'

const STORAGE_KEY = 'user';

export const userService = {
    login,
    signup,
    logout,
    getUsers,
    getUser
}

function getUser() {
    return _loadUser();
}

async function getUsers() {
    return httpService.get(`user`);
}

async function login(userCred) {
    const res = await httpService.post(`auth/login`, userCred)
    return _handleLoggedinUser(res)
}

async function logout() {
    await httpService.post(`auth/logout`)
    sessionStorage.clear();
}

async function signup(userCred) {
    const res = await httpService.post(`auth/signup`, userCred)
    return _handleLoggedinUser(res)
}

function _handleLoggedinUser(user) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user;
}

function _loadUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
}