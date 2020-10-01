
// BACKEND:
const boxMap = {};

function createBoxStatus() {
    return {
        msgs: [],
        connectedUsers: [],
        currSong: {
            id: null,
            isPlaying: false,
            secPlayed: 0
        }
    }
}

// FRONTEND: ON ENTRY TO BOX
socketService.emit('join box', boxInfo);

// BACKEND:
function getBoxStatus(boxId) {
    if (!boxMap[boxId]) boxMap[boxId] = createBoxStatus();
    return boxMap[boxId];
}

function connectSockets(io) {
    io.on('connection', socket => {

        socket.on('join box', (boxInfo) => {
            if (socket.myBox) {
                if (socket.myBox === boxInfo.boxId) return;
                leaveBox(socket, io, currUser);
            }
            socket.myBox = boxInfo.boxId;
            socket.join(socket.myBox);
            const boxStatus = getBoxStatus(socket.myBox);
            socket.emit('got box status', boxStatus);
            boxMap[socket.myBox].connectedUsers.push(boxInfo.user);
            io.to(socket.myBox).emit('joined new box', boxStatus.connectedUsers);
        })

        // FRONTEND:
        socketService.on('got box status', this.props.setBoxStatus);



        // FRONTEND: EXAMPLE FOR SYNC REQUEST
        socketService.emit('sync song time', boxInfo);

        // BACKEND:
        socket.on('sync song time', () => {
            if (!socket.myBox) return;
            socket.emit('got seek update', boxMap[socket.myBox].currSong.secPlayed);
        })
    })
}




















function leaveBox(socket, io, currUser) {
    const newConnectedUsers = boxMap[socket.myBox].connectedUsers.filter(user => user.id !== currUser.id)
    boxMap[socket.myBox].connectedUsers = newConnectedUsers;

    if (boxMap[socket.myBox].connectedUsers.length === 0) boxMap[socket.myBox] = null;
    else io.to(socket.myBox).emit('joined new box', newConnectedUsers);
    socket.leave(socket.myBox);
}