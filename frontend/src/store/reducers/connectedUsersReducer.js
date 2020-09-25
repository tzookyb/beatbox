const initialState = {
    connectedUsers: [],
}

export function connectedUsersReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CONNECTED_USERS':
            return {
                ...state,
                connectedUsers: action.connectedUsers
            }
        case 'ADD_CONNECTED_USER':
            return {
                ...state, connectedUsers: [...state.connectedUsers, action.user]
            }
        case 'removeConnectedUser':
            return {
                ...state, connectedUsers: state.connectedUsers.filter(user => user._id !== action.user)
            }
        default:
            return state;
    }
}
