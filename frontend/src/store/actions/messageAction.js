
import {socketService} from '../../services/socketService'

export function loadMessages(boxId) {
    return async dispatch => {
      const messages = await socketService.getMessagesByBoxId(boxId);
      dispatch({ type: 'SET_MESSAGES', messages })
    };
  }

export function addMessage(boxId, msg) {
    return async dispatch => {
      const message = await socketService.addMessagesToBox(boxId,msg);
      dispatch({ type: 'ADD_MESSAGE', message })
    };
  }