
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
            console.log(boxId)
            if (socket.myBox) {
                socket.leave(socket.myBox)
            }
            socket.join(boxId)
            socket.myBox = boxId;
            io.to(socket.myBox).emit('joined new box', boxId)
        })
        socket.on('song time changed', secPlayed => {
            io.to(socket.myBox).emit('update song time', secPlayed)
        })
        socket.on('set currSong', currSong => {
            io.to(socket.myBox).emit('song changed', currSong)
        })
        socket.on('set song status', isPlaying => {
            io.to(socket.myBox).emit('song status changed', isPlaying)
        })
        socket.on('box songs changed', box => {
            io.to(socket.myBox).emit('box changed', box)
        })
    })
}