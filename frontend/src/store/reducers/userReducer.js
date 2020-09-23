
import { userService } from '../../services/userService'

const initialState = {
    users: [],
    loggedinUser: userService.getUser()
}

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users: action.users
            }
        case 'SET_USER':
            return {
                ...state,
                loggedinUser: action.user
            }
        case 'ADD_USER':
            return {
                ...state,
                users: [...state.users, action.user],
                loggedinUser: action.user
            }
        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map(user => {
                    if (action.user._id === user._id) return action.user
                    return user;
                })
            }
        default:
            return state
    }
}