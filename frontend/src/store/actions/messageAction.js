

export function loadMessages(messages) {
  return dispatch => {
    dispatch({ type: 'SET_MESSAGES', messages })
  };
}

export function addMessage(message) {
  return dispatch => {
    dispatch({ type: 'ADD_MESSAGE', message })
  };
}

