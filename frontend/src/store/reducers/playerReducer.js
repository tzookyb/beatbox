
const initialState = {
    playerBox: null
}

export function playerReducer(state = initialState, action) {
    switch (action.type) {
        case 'PLAYER_SET_BOX':
            console.log('reducer', action);
            return {
                ...state,
                playerBox: action.box
            }
        default:
            return state
    }
}