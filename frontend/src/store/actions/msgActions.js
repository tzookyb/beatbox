export function notify(notify) {
  return dispatch => {
    dispatch({ type: 'SET_NOTIFY', notify })
  };
}

export function addMsg(msg) {
  return (dispatch, getState) => {
    dispatch({ type: 'ADD_MSG', msg })
    const unread = ++getState().msgReducer.unread;
    dispatch({ type: 'SET_UNREAD', unread })
  }
}

export function setReadMsg(num = 0) {
  return dispatch => {
    dispatch({ type: 'SET_UNREAD', unread: num })
  }
}