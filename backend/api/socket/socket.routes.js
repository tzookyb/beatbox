module.exports = connectSockets

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

function connectSockets(io) {
    io.on('connection', socket => {

        var currUser;

        socket.on('join box', (boxInfo) => {
            currUser = boxInfo.user;
            console.log('join box')
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

        socket.on('disconnect', () => {
            console.log('disconnect')
            // THIS LINE FOR DEV PURPOSES:
            if (!socket.myBox) return;
            leaveBox(socket, io, currUser)

        })

        // BOX SOCKETS ***********************************
        socket.on('set currBox', box => {
            console.log('set currBox')
            if (!socket.myBox) return;
            io.to(socket.myBox).emit('box changed', box);
        })

        socket.on('get active boxes', () => {
            console.log('get active boxes');
            if (!socket.myBox) return;
            const activeBoxes = getActiveBoxes();
            socket.emit('got active boxes', activeBoxes);
        })

        // PLAYER SOCKETS ***********************************
        socket.on('update backend currSong', currSong => {
            if (!socket.myBox) return;
            boxMap[socket.myBox].currSong = currSong;
        })

        socket.on('set currSong', currSong => {
            console.log('set currSong');
            if (!socket.myBox) return;
            boxMap[socket.myBox].currSong = currSong;
            io.to(socket.myBox).emit('got player update', currSong);
        })

        socket.on('sync song time', () => {
            console.log('sync song time');
            if (!socket.myBox) return;
            socket.emit('got seek update', boxMap[socket.myBox].currSong.secPlayed);
        })

        socket.on('update player seek', secPlayed => {
            console.log('update player seek')
            if (!socket.myBox) return;
            io.to(socket.myBox).emit('got seek update', secPlayed);
        })

        // CHAT SOCKETS **************************************
        socket.on('chat newMsg', msg => {
            console.log('chat newMsg')
            if (!socket.myBox) return;
            boxMap[socket.myBox].msgs.push(msg);
            io.to(socket.myBox).emit('chat addMsg', msg);
        })
        socket.on('chat typing', typingStr => {
            console.log('chat typing')
            if (!socket.myBox) return;
            socket.broadcast.to(socket.myBox).emit('chat showTyping', typingStr)
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

function getBoxStatus(boxId) {
    if (!boxMap[boxId]) boxMap[boxId] = createBoxStatus();
    return boxMap[boxId];
}

function getActiveBoxes() {
    const activeBoxes = [];
    for (const box in boxMap) {
        if (!boxMap[box]) continue;
        activeBoxes.push({ boxId: box, userCount: boxMap[box].connectedUsers.length })
    }
    return activeBoxes;
}