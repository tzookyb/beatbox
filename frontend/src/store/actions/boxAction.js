import { boxService } from "../../services/boxService"
import { socketService } from "../../services/socketService";

export function loadBoxes(query) {
  return async dispatch => {
    const boxes = await boxService.query(query);
    dispatch({ type: 'SET_BOXES', boxes })
  };
}

export function loadBox(boxId) {
  return async dispatch => {
    const box = await boxService.getById(boxId);
    dispatch({ type: 'SET_BOX', box })
  };
}

export function saveBox(box) {
  return async dispatch => {
    const newBox = await boxService.save(box);
    dispatch({ type: 'ADD_BOX', box: newBox })
    return newBox;
  };
}

// UPDATE FROM SOCKET:
export function gotBoxUpdate(box) {
  return dispatch => {
    dispatch({ type: 'UPDATE_BOX', box })
  };
}

export function updateBox(box) {
  return dispatch => {
    boxService.update(box);
    socketService.emit('set currBox', box);
    dispatch({ type: 'UPDATE_BOX', box })
  };
}
export function setFilter(query) {
  return dispatch => {
    dispatch({ type: 'SET_FILTER', filter: query })
  }
}

export function removeBox(boxId) {
  return async dispatch => {
    await boxService.remove(boxId)
    dispatch({ type: 'REMOVE_BOX', boxId })
  };
}
