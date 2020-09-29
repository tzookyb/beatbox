export function loadConnectedUsers(connectedUsers) {
  return dispatch => {
    dispatch({ type: 'SET_CONNECTED_USERS', connectedUsers })
  }
}