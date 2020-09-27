module.exports = connectSockets

const boxMap = {}
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

function leaveBox(socket, myBox, io) {
    socket.leave(myBox.boxId);
    const boxStatus = getBoxStatus(myBox.boxId);
    // if (boxMap[socket.myBox].connectedUsers.length > 1) {
    const newConnectedUsers = boxMap[socket.myBox].connectedUsers.filter(user => user.id !== myBox.user.id)
    boxMap[socket.myBox].connectedUsers = newConnectedUsers;
    // } 
    if (boxMap[myBox.boxId].connectedUsers.length === 0) boxMap[myBox.boxId] = null;
    //     boxMap[socket.myBox] = createBoxStatus();
    // }
    // io.to(socket.myBox).emit('leave box', boxStatus.connectedUsers);
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
        var myBox;
        socket.on('join box', (boxInfo) => {
            myBox = boxInfo;
            if (socket.myBox) {
                leaveBox(socket, myBox, io);
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

        // socket.on('disconnect', () => {
        //     try {
        //         leaveBox(socket, myBox)
        //     } catch (err) {
        //         console.log(err);
        //     }
        // })

        // BOX SOCKETS ***********************************
        socket.on('set currBox', box => {
            io.to(socket.myBox).emit('box changed', box);
        })
        socket.on('box songs changed', box => {
            io.to(socket.myBox).emit('box changed', box)
        })

        // PLAYER SOCKETS ***********************************
        socket.on('update progress', secPlayed => {
            boxMap[socket.myBox].currSong.secPlayed = secPlayed;
        })

        socket.on('song time changed', secPlayed => {
            boxMap[socket.myBox].currSong.secPlayed = secPlayed;
            io.to(socket.myBox).emit('update song time', secPlayed)
        })
        socket.on('set currSong', currSong => {
            boxMap[socket.myBox].currSong = currSong;
            io.to(socket.myBox).emit('song changed', (currSong))
        })
        socket.on('get song time', () => {
            if (boxMap[myBox.boxId]) {
                const { secPlayed } = boxMap[myBox.boxId].currSong
                io.to(socket.myBox).emit('update song time', secPlayed)
            }
        })
        // CHAT SOCKETS **************************************
        socket.on('chat newMsg', msg => {
            boxMap[socket.myBox].msgs.push(msg);
            io.to(socket.myBox).emit('chat addMsg', msg);
        })
        socket.on('chat typing', typingStr => {
            socket.broadcast.to(socket.myBox).emit('chat showTyping', typingStr)
        })
    })
}