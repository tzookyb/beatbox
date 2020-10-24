const { getById, resetData } = require("../box/box.service");

module.exports = connectSockets

var boxMap = {};
var gActiveBoxes = null;
var gUsersCount = 0;
resetDemoData();

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
        socket.join('beatbox');
        socket.emit('got active boxes', gActiveBoxes);
        gUsersCount++;
        console.log("connect", gUsersCount);

        socket.on('join box', async (boxInfo) => {
            currUser = boxInfo.user;
            console.log('join box')
            if (socket.myBox) {
                if (socket.myBox === boxInfo.boxId) return;
                await leaveBox(socket, io, currUser);
            }
            socket.myBox = boxInfo.boxId;
            socket.join(socket.myBox);
            const boxStatus = getBoxStatus(socket.myBox);
            socket.emit('got box status', boxStatus);
            boxMap[socket.myBox].connectedUsers.push(boxInfo.user);
            io.to(socket.myBox).emit('joined new box', boxStatus.connectedUsers);
            handleActiveBoxes(socket.myBox, io);
        })

        socket.on('disconnect', () => {
            gUsersCount--;
            if (!gUsersCount) {
                setTimeout(resetDemoData, 5000);
            }
            console.log('disconnect', gUsersCount);
            if (!socket.myBox) return;
            leaveBox(socket, io, currUser);
        })

        // BOX SOCKETS ***********************************
        socket.on('set currBox', box => {
            console.log('set currBox')
            if (!socket.myBox) return;
            io.to(socket.myBox).emit('box changed', box);
        })

        // PLAYER SOCKETS ***********************************
        socket.on('get intro', async (boxId) => {
            const box = await getById(boxId);
            const currSong = boxMap[boxId].currSong;
            const youtubeId = box.songs.find(song => song.id === currSong.id).youtubeId;
            const secPlayed = currSong.secPlayed
            const intro = { youtubeId, secPlayed };
            socket.emit('got intro', intro);
        })

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
            if (!socket.myBox) return;
            socket.broadcast.to(socket.myBox).emit('chat showTyping', typingStr)
        })
    })
}

async function handleActiveBoxes(boxId, io) {
    // If no active boxes, create empty array:
    if (!gActiveBoxes) {
        gActiveBoxes = [];

    } else if (gActiveBoxes.length) {
        // Check if box already exists, if so remove it:
        const boxExistsIdx = gActiveBoxes.findIndex(box => box._id == boxId);
        if (boxExistsIdx !== -1) {
            gActiveBoxes.splice(boxExistsIdx, 1)
        }
    }
    if (boxMap[boxId] && boxMap[boxId].connectedUsers.length) {
        const newBox = await getById(boxId);
        gActiveBoxes.unshift(newBox);
        gActiveBoxes[0].connectedUsers = boxMap[boxId].connectedUsers;
        if (gActiveBoxes.length > 3) gActiveBoxes = gActiveBoxes.slice(0, 3);
    }
    if (io) io.to('beatbox').emit('got active boxes', gActiveBoxes);
}

async function leaveBox(socket, io, currUser) {
    const newConnectedUsers = boxMap[socket.myBox].connectedUsers.filter(user => user.id !== currUser.id)
    boxMap[socket.myBox].connectedUsers = newConnectedUsers;
    if (boxMap[socket.myBox].connectedUsers.length === 0) {
        delete boxMap[socket.myBox];
    } else {
        io.to(socket.myBox).emit('joined new box', newConnectedUsers);
    }
    await handleActiveBoxes(socket.myBox, io);
    socket.leave(socket.myBox);
}

function getBoxStatus(boxId) {
    if (!boxMap[boxId]) boxMap[boxId] = createBoxStatus();
    return boxMap[boxId];
}

async function resetDemoData() {
    const demoData = require('../../demoData/demoData.json');
    if (gUsersCount) return;
    await resetData();
    boxMap = JSON.parse(JSON.stringify(demoData));
    for (const box in boxMap) {
        handleActiveBoxes(box);
    }
}