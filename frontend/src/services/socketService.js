import io from 'socket.io-client';

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/' : '//localhost:3030';

let socket;


let gMapMessages = [
  {
    boxId: '_s4MlLQ',
    messages: [
      {
        text: "hi",
        id: "012",
        submitBy: "Idan",
        submitAt:1600582337051,
        type: 'chat',
        avatar: "https://res-console.cloudinary.com/daqs7x8my/thumbnails/transform/v1/image/upload//v1600700773/am9lYWR2YnB4MWl6ZTVmcnZvM2c=/drilldown"
      },
      {
        text: "Bey",
        id: "011",
        submitBy: "Hilla",
        submitAt:1600582337051,
        type: 'chat',
        avatar: "https://res.cloudinary.com/daqs7x8my/image/upload/c_thumb,w_200,g_face/v1600700980/h1xxkhwainjt1kzrwebq.jpg"
      },
      {
        text: "BoxBeat is so fun app  !",
        id: "FK4kf",
        submitBy: "Hilla",
        submitAt:1600582337051,
        type: 'chat',
        avatar: "https://res.cloudinary.com/daqs7x8my/image/upload/c_thumb,w_200,g_face/v1600700980/h1xxkhwainjt1kzrwebq.jpg"
      },
      {
        text: "Matan delete the song: ",
        id: "014",
        submitBy: "system",
        submitAt:1600582337051,
        type: 'system',
        avatar: ""
      }
    ]
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
