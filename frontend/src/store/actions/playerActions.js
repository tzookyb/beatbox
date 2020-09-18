export function updatePlayerBox(box) {
    return async dispatch => {
        dispatch({ type: 'PLAYER_SET_BOX', box })
    };
}