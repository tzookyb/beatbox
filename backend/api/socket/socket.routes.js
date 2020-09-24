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
        },
        // typingStr: ''
    }
}

function getBoxStatus(boxId) {
    if (!boxMap[boxId]) boxMap[boxId] = createBoxStatus()
    return boxMap[boxId]
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
            io.to(socket.myBox).emit('chat addMsg', msg)
        })
        socket.on('chat typing', typingStr => {
            // boxMap[socket.myBox].typingStr = typingStr;
            socket.broadcast.to(socket.myBox).emit('chat showTyping', typingStr)
        })

        socket.on('chat topic', topic => {
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic;
        })
        socket.on('song time changed', secPlayed => {
            boxMap[socket.myBox].secPlayed = secPlayed;
            io.to(socket.myBox).emit('update song time', secPlayed)
        })
        socket.on('set currSong', currSong => {
            boxMap[socket.myBox].currSong.id = currSong.id
            boxMap[socket.myBox].currSong.secPlayed = currSong.secPlayed
            boxMap[socket.myBox].currSong.isPlaying = currSong.isPlaying

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

