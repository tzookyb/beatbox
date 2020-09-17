export function updatePlayerBox(box) {
    console.log(box);
    return async dispatch => {
        dispatch({ type: 'PLAYER_SET_BOX', box })
    };
}