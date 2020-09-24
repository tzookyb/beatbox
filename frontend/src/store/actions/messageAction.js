

export function loadMessages(messages) {
  return async dispatch => {
    dispatch({ type: 'SET_MESSAGES', messages })
  };
}

export function addMessage(message) {
  return async dispatch => {
    dispatch({ type: 'ADD_MESSAGE', message })
  };
}

