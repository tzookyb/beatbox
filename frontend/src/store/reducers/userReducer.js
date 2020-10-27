const initialState = {
    loggedinUser: {},
    connectedUsers: []
}

export function userReducer(state = initialState, action) {
    switch (action.type) {

        case 'SET_USER':
            return { ...state, loggedinUser: action.user }

        case 'SET_CONNECTED_USERS':
            return { ...state, connectedUsers: action.connectedUsers }

        default:
            return state
    }
}