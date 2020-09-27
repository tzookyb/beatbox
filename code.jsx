// Frontend:
socketService.on('get box status', this.setBoxStatus);

setBoxStatus = (boxStatus) => {
    this.props.setCurrSong(boxStatus.currSong);
    this.props.loadMsgs(boxStatus.msgs);
}

// backend:
const boxMap = {}
function createBoxStatus() {
    return {
        msgs: [],
        participants: [],
        currSong: {
            id: null,
            secPlayed: 0,

        },
    }
}
function getBoxStatus(boxId) {
    if (!boxMap[boxId]) boxMap[boxId] = createBoxStatus();
    return boxMap[boxId];
}
function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('join box', (boxId, miniUser) => {
            if (socket.myBox) {
                socket.leave(socket.myBox)
            }
            socket.join(boxId)
            socket.myBox = boxId;
            const boxStatus = getBoxStatus(boxId)
            boxStatus.participants.push(miniUser)
            io.to(socket.myBox).emit('joined new box', boxStatus.participants)
            socket.emit('get box status', boxStatus)
        })
        socket.on('chat newMsg', msg => {
            boxMap[socket.myBox].msgs.push(msg);
            io.to(socket.myBox).emit('chat addMsg', msg);
        })
        socket.on('set currSong', currSong => {
            boxMap[socket.myBox].currSongId = currSong.id
            boxMap[socket.myBox].secPlayed = currSong.secPlayed
            boxMap[socket.myBox].isPlaying = currSong.isPlaying

            io.to(socket.myBox).emit('song changed', currSong)
        })
    })
}