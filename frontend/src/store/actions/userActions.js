import { userService } from "../../services/userService"

export function loadConnectedUsers(connectedUsers) {
    return dispatch => {
        dispatch({ type: 'SET_CONNECTED_USERS', connectedUsers })
    }
}

export function loadUser() {
    return async dispatch => {
        const user = await userService.getLoggedUser()
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
        try {
            const user = await userService.login(userCreds)
            dispatch({ type: 'SET_USER', user });
            return user;
        } catch (error) {
            throw error;
        }
    };
}

export function logout() {
    return async dispatch => {
        await userService.logout();
        const user = userService.getLoggedUser();
        dispatch({ type: 'SET_USER', user });
    };
}

export function signup(userCreds) {
    return async dispatch => {
        try {
            const user = await userService.signup(userCreds);
            dispatch({ type: 'SET_USER', user });
        } catch (err) {
            throw err
        }
    };
}

export function toggleFavorite(boxId) {
    return async dispatch => {
        const user = await userService.toggleFavorite(boxId);
        dispatch({ type: 'SET_USER', user });
    }
}