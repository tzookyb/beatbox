module.exports = connectSockets

const boxMap = {}
function createBoxStatus() {
    return {
        msgs: [],
        participants: [],
        currSong: {
            id: null,
            secPlayed: 0,
            isPlaying: true
        }
    }
}

function getBoxStatus(boxId) {
    if (!boxMap[boxId]) boxMap[boxId] = createBoxStatus()
    return boxMap[boxId]
}

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('chat newMsg', msg => {
            io.to(socket.myTopic).emit('chat addMsg', msg)
        })
        socket.on('chat topic', topic => {
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic;
        })
        socket.on('chat typing', userName => {
            socket.broadcast.to(socket.myTopic).emit('chat showTyping', userName)
        })
        socket.on('join box', (boxId, miniUser) => {
            console.log(boxId)
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
        socket.on('song time changed', secPlayed => {
            console.log("connectSockets -> secPlayed", secPlayed)

            boxMap[socket.myBox].secPlayed = secPlayed;
            io.to(socket.myBox).emit('update song time', secPlayed)
        })
        socket.on('set currSong', currSong => {
            console.log('set currsong')
            boxMap[socket.myBox].currSongId = currSong.id
            boxMap[socket.myBox].secPlayed = currSong.secPlayed
            boxMap[socket.myBox].isPlaying = currSong.isPlaying

            io.to(socket.myBox).emit('song changed', currSong)
        })
        socket.on('set currBox', box => {
            console.log("connectSockets -> box", box);
            io.to(socket.myBox).emit('box changed', box);
        })
        socket.on('box songs changed', box => {
            io.to(socket.myBox).emit('box changed', box)
        })
    })
}

