import { boxService } from "../../services/boxService"
import { socketService } from "../../services/socketService";

export function loadBoxes(query) {
  console.log("loadBoxes -> query", query)
  return async dispatch => {
    const boxes = await boxService.query(query);
    dispatch({ type: 'SET_BOXES', boxes })
  };
}

export function loadBox(boxId) {
  return async dispatch => {
    const currBox = await boxService.getById(boxId);
    dispatch({ type: 'SET_CURR_BOX', currBox })
  };
}

export function saveBox(box) {
  return async dispatch => {
    const newBox = await boxService.save(box);
    dispatch({ type: 'ADD_BOX', box: newBox })
    return newBox;
  };
}

export function setFilter(query) {
  return dispatch => {
    dispatch({ type: 'SET_FILTER', filter: query })
  }
}

export function updateBox(currBox) {
  return dispatch => {
    boxService.update(currBox);
    socketService.emit('set currBox', currBox);
    dispatch({ type: 'UPDATE_BOX', currBox })
  };
}

export function removeBox(boxId) {
  console.log("removeBox -> boxId", boxId)
  return async dispatch => {
    await boxService.remove(boxId)
    dispatch({ type: 'REMOVE_BOX', boxId })
  };
}

// UPDATES FROM SOCKET:
export function gotBoxUpdate(currBox) {

  return dispatch => {
    dispatch({ type: 'UPDATE_BOX', currBox })
  };
}