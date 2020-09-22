
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
        // socket.on('song time changed', timestamp => {
        //     io.to(socket.myBox).emit('update song time', timestamp)
        // })
        socket.on('set currSong', currSong => {
            io.to(socket.myBox).emit('song changed', currSong)
        })
        // socket.on('set songStatus', isPlaying => {
        //     io.to(socket.myBox).emit('songStatus changed', isPlaying)
        // })
        socket.on('box songs changed', box => {
            io.to(socket.myBox).emit('box changed', box)
        })
    })
}