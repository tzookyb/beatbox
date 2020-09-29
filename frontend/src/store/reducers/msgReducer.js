const initialState = {
    msgs: [],
    emojis: []
}

export function msgReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_MSGS':
            return {
                ...state,
                msgs: action.msgs
            }
        case 'ADD_MSG':
            return {
                ...state, msgs: [...state.msgs, action.msg]
            }
        default:
            return state;
    }
}
