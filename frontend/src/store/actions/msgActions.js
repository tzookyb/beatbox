export function notify(notify) {
  return dispatch => {
    dispatch({ type: 'SET_NOTIFY', notify })
  };
}

export function addMsg(msg) {
  return dispatch => {
    dispatch({ type: 'ADD_MSG', msg })
  }
}