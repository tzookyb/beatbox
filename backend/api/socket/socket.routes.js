module.exports = connectSockets

const boxMap = {}
function createBoxStatus() {
    return {
        msgs: [],
        connectedUsers: [],
        currSong: {
            id: null,
            secPlayed: 0,
        },
    }
}

function leaveBox(socket, boxInfo, io) {
    socket.leave(socket.myBox);
    const boxStatus = getBoxStatus(socket.myBox);
    // if (boxMap[socket.myBox].connectedUsers.length > 1) {
    const newConnectedUsers = boxMap[socket.myBox].connectedUsers.filter(user => user.id !== boxInfo.user.id)
    boxMap[socket.myBox].connectedUsers = newConnectedUsers;
    // } 
    // if (boxMap[socket.myBox].connectedUsers.length === 1) {
    //     boxMap[socket.myBox] = createBoxStatus();
    // }
    // io.to(socket.myBox).emit('leave box', boxStatus.connectedUsers);
    console.log("leaveBox -> boxStatus.connectedUsers", boxStatus.connectedUsers)
}

function getBoxStatus(boxId) {
    if (!boxMap[boxId]) boxMap[boxId] = createBoxStatus();
    return boxMap[boxId];
}

function addConnectedUser(socket, boxInfo) {
    const boxStatus = getBoxStatus(boxInfo.boxId);
    const isUserConnected = boxStatus.connectedUsers.find(user => user.id === boxInfo.user.id);
    if (!isUserConnected) {
        boxMap[socket.myBox].connectedUsers.push(boxInfo.user);
    }
}

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('join box', (boxInfo) => {
            if (socket.myBox) {
                leaveBox(socket, boxInfo, io);
                const boxStatus = getBoxStatus(socket.myBox);
                io.to(socket.myBox).emit('joined new box', boxStatus.connectedUsers);
            }
            socket.join(boxInfo.boxId);
            socket.myBox = boxInfo.boxId;
            const boxStatus = getBoxStatus(boxInfo.boxId);
            addConnectedUser(socket, boxInfo);
            io.to(socket.myBox).emit('joined new box', boxStatus.connectedUsers);
            socket.emit('get box status', boxStatus);
        })
        socket.on('chat newMsg', msg => {
            boxMap[socket.myBox].msgs.push(msg);
            io.to(socket.myBox).emit('chat addMsg', msg);
        })
        socket.on('chat typing', typingStr => {
            socket.broadcast.to(socket.myBox).emit('chat showTyping', typingStr)
        })
        socket.on('song time changed', secPlayed => {
            boxMap[socket.myBox].secPlayed = secPlayed;
            io.to(socket.myBox).emit('update song time', secPlayed)
        })
        socket.on('set currSong', currSong => {
            boxMap[socket.myBox].currSongId = currSong.id
            boxMap[socket.myBox].secPlayed = currSong.secPlayed
            boxMap[socket.myBox].isPlaying = currSong.isPlaying

            io.to(socket.myBox).emit('song changed', currSong)
        })
        socket.on('set currBox', box => {
            io.to(socket.myBox).emit('box changed', box);
        })
        socket.on('box songs changed', box => {
            io.to(socket.myBox).emit('box changed', box)
        })
    })
}

