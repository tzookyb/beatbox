export function loadConnectedUsers(connectedUsers) {
  // console.log("loadConnectedUsers -> connectedUsers", connectedUsers)
  return dispatch => {
    dispatch({ type: 'SET_CONNECTED_USERS', connectedUsers })
  };
}

export function addConnectedUser(user) {
  return dispatch => {
    dispatch({ type: 'ADD_CONNECTED_USER', user })
  };
}

export function removeConnectedUser(user) {
  return dispatch => {
    dispatch({ type: 'REMOVE_CONNECTED_USER', user })
  };
}