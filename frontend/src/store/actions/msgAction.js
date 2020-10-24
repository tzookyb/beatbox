export function loadMsgs(msgs) {
  return dispatch => {
    dispatch({ type: 'SET_MSGS', msgs })
  };
}

export function addMsg(msg) {
  return dispatch => {
    dispatch({ type: 'ADD_MSG', msg })
  };
}

export function notify(notify) {
  return dispatch => {
    dispatch({ type: 'SET_NOTIFY', notify })
  };

}