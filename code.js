// BACKEND:
const boxMap = {};

function createBoxStatus() {
    return {
        msgs: [],
        connectedUsers: [],
        currSong: {
            id: null,
            isPlaying: false,
            secPlayed: 0,
        },
    }
}


// FRONTEND:
socketService.emit('join box', boxInfo);

// BACKEND:
socket.on('join box', (boxInfo) => {
    if (socket.myBox) {
        leaveBox(socket, boxInfo);
        const boxStatus = getBoxStatus(socket.myBox);
        io.to(socket.myBox).emit('joined new box', boxStatus.connectedUsers);
    }
    socket.myBox = boxInfo.boxId;
    socket.join(socket.myBox);
    boxMap[socket.myBox].connectedUsers.push(boxInfo.user);
    const boxStatus = getBoxStatus(socket.myBox);
    io.to(socket.myBox).emit('joined new box', boxStatus.connectedUsers);
    socket.emit('got box status', boxStatus);
})
function getBoxStatus(boxId) {
    if (!boxMap[boxId]) boxMap[boxId] = createBoxStatus();
    return boxMap[boxId];
}





// FRONTEND:
socketService.on('got box status', this.props.setBoxStatus);


// BACKEND

function leaveBox(socket, boxInfo) {
    const newConnectedUsers = boxMap[socket.myBox].connectedUsers.filter(user => user.id !== boxInfo.user.id)
    boxMap[socket.myBox].connectedUsers = newConnectedUsers;

    if (boxMap[socket.myBox].connectedUsers.length === 0) boxMap[socket.myBox] = null;

    socket.leave(socket.myBox);
}



// BOX SOCKETS ***********************************
socket.on('set currBox', box => {
    io.to(socket.myBox).emit('box changed', box);
})

// PLAYER SOCKETS
socket.on('set currSong', currSong => {
    boxMap[socket.myBox].currSong = currSong;
    io.to(socket.myBox).emit('got player update', currSong);
})

// SYNC
socket.on('sync song time', () => {
    socket.emit('got seek update', boxMap[socket.myBox].currSong.secPlayed);
})
    })
}