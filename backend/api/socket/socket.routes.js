module.exports = connectSockets
const SITE = 'beatbox';
var gUsersCount = 0;
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

function leaveBox(socket, boxInfo) {
    const newConnectedUsers = boxMap[socket.myBox].connectedUsers.filter(user => user.id !== boxInfo.user.id)
    boxMap[socket.myBox].connectedUsers = newConnectedUsers;
    if (boxMap[socket.myBox].connectedUsers.length === 0) boxMap[socket.myBox] = null;
    // console.log("leaveBox -> boxMap", boxMap)
    socket.leave(boxInfo.boxId);
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
function getActiveBoxes() {
    const activeBoxes = [];
    for (const box in boxMap) {
        if (!boxMap[box]) return;
        activeBoxes.push({ boxId: box, userCount: boxMap[box].connectedUsers.length })
    }
    return activeBoxes;
}

function connectSockets(io) {
    io.on('connection', socket => {

        socket.join(SITE);
        gUsersCount++;
        io.to(SITE).emit('got global users', gUsersCount);
        var myBox;

        socket.on('join box', (boxInfo) => {
            console.log('join box')
            myBox = boxInfo;
            if (socket.myBox) {
                leaveBox(socket, boxInfo);
                const boxStatus = getBoxStatus(socket.myBox);
                io.to(socket.myBox).emit('joined new box', boxStatus.connectedUsers);
            }
            socket.join(boxInfo.boxId);
            console.log(boxInfo.boxId);
            socket.myBox = boxInfo.boxId;
            const boxStatus = getBoxStatus(boxInfo.boxId);
            addConnectedUser(socket, boxInfo);
            console.log("connectSockets -> boxStatus", boxStatus)
            io.to(socket.myBox).emit('joined new box', boxStatus.connectedUsers);
            socket.emit('got box status', boxStatus);
        })

        socket.on('disconnect', () => {
            console.log('disconnect')
            gUsersCount--;
            io.to(SITE).emit('got global users', gUsersCount);
            if (!myBox) return;
            const newConnectedUsers = boxMap[myBox.boxId].connectedUsers.filter(user => user.id !== myBox.user.id)
            boxMap[myBox.boxId].connectedUsers = newConnectedUsers;
            if (boxMap[socket.myBox].connectedUsers.length === 0) {
                boxMap[socket.myBox] = null;
                socket.leave(myBox.boxId);
            } else {
                io.to(socket.myBox).emit('joined new box', newConnectedUsers);
                socket.leave(myBox.boxId);
            }
        })

        // BOX SOCKETS ***********************************
        socket.on('set currBox', box => {
            console.log('set currBox')
            io.to(socket.myBox).emit('box changed', box);
        })

        socket.on('get active boxes', () => {
            console.log('get active boxes');
            const activeBoxes = getActiveBoxes();
            socket.emit('got active boxes', activeBoxes);
        })

        // PLAYER SOCKETS ***********************************
        socket.on('update backend currSong', currSong => {
            if (!myBox) return;
            boxMap[myBox.boxId].currSong = currSong;
        })

        socket.on('set currSong', currSong => {
            console.log('set currSong');
            boxMap[myBox.boxId].currSong = currSong;
            io.to(myBox.boxId).emit('got player update', currSong);
        })

        socket.on('sync song time', () => {
            console.log('sync song time');
            if (!myBox) return;
            socket.emit('got seek update', boxMap[myBox.boxId].currSong.secPlayed);
        })

        socket.on('update player seek', secPlayed => {
            console.log('update player seek')
            io.to(myBox.boxId).emit('got seek update', secPlayed);
        })

        // CHAT SOCKETS **************************************
        socket.on('chat newMsg', msg => {
            console.log('chat newMsg')
            boxMap[socket.myBox].msgs.push(msg);
            io.to(socket.myBox).emit('chat addMsg', msg);
        })
        socket.on('chat typing', typingStr => {
            console.log('chat typing')
            socket.broadcast.to(socket.myBox).emit('chat showTyping', typingStr)
        })
    })
}