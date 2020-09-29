const initialState = {
    connectedUsers: [],
}

export function connectedUsersReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CONNECTED_USERS':
            return { ...state, connectedUsers: action.connectedUsers }

        default:
            return state;
    }
}