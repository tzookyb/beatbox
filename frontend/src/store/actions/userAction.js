import { userService } from "../../services/userService"

export function loadUser() {
    return async dispatch => {
        const user = await userService.getUser()
        dispatch({ type: 'SET_USER', user })
    }
}

export function loadUsers() {
    return async dispatch => {
        const users = await userService.getUsers()
        dispatch({ type: 'SET_USERS', users });
        return users;
    };
}

export function login(userCreds) {
    return async dispatch => {
        const user = await userService.login(userCreds)
        dispatch({ type: 'SET_USER', user });
        return user;
    };
}

export function logout() {
    return async dispatch => {
        await userService.logout();
        const user = userService.getUser();
        dispatch({ type: 'SET_USER', user });
    };
}

export function signup(userCreds) {
    return async dispatch => {
        const user = await userService.signup(userCreds);
        dispatch({ type: 'SET_USER', user });
    };
}
