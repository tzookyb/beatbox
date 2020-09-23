import io from 'socket.io-client';

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/' : '//localhost:3030';

let socket;

let gMapMessages = [
  {
    boxId: '',
    messages: []
  }
]


export const socketService = {
  setup,
  terminate,
  on,
  off,
  emit,
  getMessagesByBoxId,
  addMessagesToBox
};

function getMessagesByBoxId(boxId) {
  const messagesObjMap =  gMapMessages.find(mess => mess.boxId === boxId)
  if(!messagesObjMap) return [];
  else return messagesObjMap.messages;
}

function addMessagesToBox(boxId, message) {
  const boxIdx = gMapMessages.findIndex(mess => mess.boxId === boxId);
  if (boxIdx === -1){
    const newMessageObj = { boxId, messages: [message] }
    gMapMessages.push(newMessageObj)
  } 
  else gMapMessages[boxIdx].messages.push(message);
  return message;
}

function setup() {
  socket = io(BASE_URL);
}

function terminate() {
  socket = null;
}

function on(eventName, cb) {
  socket.on(eventName, cb);
}

function off(eventName, cb) {
  socket.off(eventName, cb);
}

function emit(eventName, data) {
  socket.emit(eventName, data);
}
