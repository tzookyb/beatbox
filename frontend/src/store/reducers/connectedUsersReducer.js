const initialState = {
    connectedUsers: [],
    globalUsers: 0,
}

export function connectedUsersReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CONNECTED_USERS':
            return {
                ...state,
                connectedUsers: action.connectedUsers
            }
        case 'SET_GLOBAL_USERS':
            return { ...state, globalUsers: action.num }

        default:
            return state;
    }
}
