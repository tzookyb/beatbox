const initialState = {
    notify: '',
    msgs: [],
    emojis: []
}

export function msgReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_MSGS':
            return { ...state, msgs: action.msgs };

        case 'ADD_MSG':
            return { ...state, msgs: [...state.msgs, action.msg] };

        case 'SET_NOTIFY':
            return { ...state, notify: action.notify };

        default:
            return state;
    }
}