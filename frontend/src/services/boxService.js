import httpService from './httpService';
import { youtubeService } from './youtubeService';
import { userService } from '../services/userService'
import { utilService } from './utilService';
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

async function query() {
    return await httpService.get('box');
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
    await userService.addBoxToUser(newBox._id);
    return newBox;
}

async function update(box) {
    return await httpService.put(`box/${box._id}`, box)
}

async function addSong(song, isFromDrag = false) {
    const youtubeId = (isFromDrag) ? song.id : song.id.videoId;
    const newSong = {
        id: utilService.makeId(8),
        youtubeId,
        title: youtubeService.titleSimplify(song.snippet.title),
        duration: await youtubeService.getDuration(song.id.videoId, song.contentDetails?.duration),
        imgUrl: song.snippet.thumbnails.high.url,
    }
    return newSong;
}

async function remove(boxId) {
    return httpService.delete(`box/${boxId}`)
}