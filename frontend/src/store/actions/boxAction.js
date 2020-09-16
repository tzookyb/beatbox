import { boxService } from "../../services/boxService"

export function loadBoxes(filterBy) {
    return async dispatch => {
        const boxes = await boxService.query(filterBy);
        dispatch({ type: 'SET_BOXES', boxes })
      };
}

export function saveBox(box) {
    return async dispatch => {
        const actionType = box._id ? 'EDIT_BOX' : 'ADD_BOX';
        const newBox = await boxService.save(box);
        dispatch({ type: actionType, box:newBox })
      };
}

export function removeBox(boxId) {
    return async dispatch => {
        await boxService.remove(boxId)
        dispatch({ type: 'REMOVE_BOX', boxId })
      };
}