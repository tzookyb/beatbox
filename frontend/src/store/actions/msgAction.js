export function loadMsgs(msgs) {
  console.log("loadMsgs -> msgs", msgs)
  return dispatch => {
    dispatch({ type: 'SET_MSGS', msgs })
  };
}

export function addMsg(msg) {
  console.log("addMsg -> msg", msg)
  return dispatch => {
    dispatch({ type: 'ADD_MSG', msg })
  };
}