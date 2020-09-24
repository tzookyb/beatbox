

export function loadMessages(messages) {
  return dispatch => {
    dispatch({ type: 'SET_MESSAGES', messages })
  };
}

export function addMessage(message) {
  console.log("addMessage -> message", message)
  return dispatch => {
    dispatch({ type: 'ADD_MESSAGE', message })
  };
}

