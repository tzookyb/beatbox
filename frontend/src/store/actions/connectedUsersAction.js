export function loadConnectedUsers(connectedUsers) {
  console.log("loadConnectedUsers -> connectedUsers", connectedUsers)
  return dispatch => {
    dispatch({ type: 'SET_CONNECTED_USERS', connectedUsers })
  };
}

export function setGlobalUsers(num) {
  return dispatch => {
    dispatch({ type: 'SET_GLOBAL_USERS', num })
  }
}
