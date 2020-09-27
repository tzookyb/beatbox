import httpService from './httpService';
import { youtubeService } from './youtubeService';
import { userService } from '../services/userService'
var gGenre = ['Hip-hop', 'Easy', 'Electronic', 'Latin', 'Rock',
    'Pop', 'Classical', 'Alternative', 'Blues', 'Disco', 'Israeli', 'Arabic']

export const boxService = {
    query,
    getById,
    getAllGenres,
    getUsedGenres,
    save,
    update,
    addSong,
    getEmptyBox,
    // addConnectedUser,
    remove
}

function getAllGenres() {
    return gGenre;
}

function getUsedGenres(boxes) {
    let allGenres = [];
    boxes.forEach(box => {
        allGenres.push(box.genre);
    })
    const genres = [...new Set(allGenres)];
    return genres;
}

async function getById(boxId) {
    return httpService.get(`box/${boxId}`)
}

async function query(query) {
    query = query || '';
    return await httpService.get(`box${query}`);
}

function getEmptyBox(user) {
    return {
        name: '',
        description: '',
        imgUrl: null,
        genre: '',
        createdBy: user,
        songs: [],
    }
}

async function save(box) {
    const newBox = await httpService.post(`box`, box);
    userService.addBoxToUser(newBox._id);
    return newBox;
}

async function update(box) {
    return await httpService.put(`box/${box._id}`, box)
}

async function addSong(song, isFromDrag = false) {
    const youtubeId = (isFromDrag) ? song.id : song.id.videoId;
    const newSong = {
        id: _makeId(),
        youtubeId,
        title: youtubeService.titleSimplify(song.snippet.title),
        duration: await youtubeService.getDuration(song.id.videoId, song.contentDetails?.duration),
        imgUrl: song.snippet.thumbnails.high.url,
    }
    return newSong;
}


// async function addConnectedUser(boxId, minimalUser) {
//     const box = await getById(boxId);
//     const newBox = { ...box };
//     const isUserInBox = newBox.connectedUsers.find(user => user.id === minimalUser.id)
//     if (!isUserInBox) {
//         newBox.connectedUsers.push(minimalUser);
//         await update(newBox);

//         //ToDO:
//         // const boxIdx = getById(minimalUser.currBoxId);
//         // boxes[boxIdx].connectedUsers.splice() 
//     }
// }

function _makeId(length = 8) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

async function remove(boxId) {
    return httpService.delete(`box/${boxId}`)
}