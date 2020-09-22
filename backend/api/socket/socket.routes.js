
module.exports = connectSockets

// function connectSockets(io) {
//     io.on('connection', socket => {
//         socket.on('chat newMsg', msg=>{
//             console.log(msg)
//             // io.emit('chat addMsg', msg)
//             // emits only to sockets in the same room
//             io.to(socket.myTopic).emit('chat addMsg', msg)
//         })
//         socket.on('chat topic', topic=>{
//             if (socket.myTopic) {
//                 socket.leave(socket.myTopic)
//             }
//             socket.join(topic)
//             socket.myTopic = topic;
//         })
//     })
// }

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
        socket.on('join box', boxId => {
            if (socket.myBox) {
                socket.leave(socket.myBox)
            }
            socket.join(boxId)
            socket.myBox = boxId;
            io.to(socket.myBox).emit('joined new box', boxId)
        })
<<<<<<< HEAD
        socket.on('song time changed', timestamp => {
        console.log("connectSockets -> timestamp", timestamp)
            io.to(socket.myBox).emit('update song time', timestamp)
=======
        socket.on('song time changed', secPlayed => {
            console.log(secPlayed)
            const res = io.to(socket.myBox).emit('update song time', secPlayed)
            console.log("connectSockets -> res", res)
>>>>>>> af5ab9c09c3547f1bb7a72243d9351639afb7d13
        })
        socket.on('set currSong', currSong => {
            console.log(currSong)
            io.to(socket.myBox).emit('song changed', currSong)
        })
        socket.on('set songStatus', isPlaying => {
            io.to(socket.myBox).emit('songStatus changed', isPlaying)
        })
        socket.on('box songs changed', box => {
            io.to(socket.myBox).emit('box changed', box)
        })
    })
}