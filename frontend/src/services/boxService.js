import httpService from './httpService';
import { youtubeService } from './youtubeService';

// import axios from 'axios';
// const BASE_URL = 'http://localhost:3030/box'

var gGenre = ['Hip-hop', 'Arabic', 'Easy', 'Electronic', 'Country', 'Latin', 'Jazz', 'Rock',
    'Pop', 'Classical', 'Alternative', 'Blues', 'Disco', 'Israeli']

export const boxService = {
    query,
    getById,
    getGenres,
    save,
    addSong,
    addLike,
    getIsUserLikeBox,
    getEmptyBox,
    addConnectedUser
    // remove,
}

function getGenres() {
    return gGenre;
}

async function getById(boxId) {
    return httpService.get(`box/${boxId}`)
}

//TODO: fix filter
async function query(filterBy) {
    // if (!filterBy) filterBy = { name: '', genre: '' };
    // else var queryStr = `?name=${filterBy.name}&genre=${filterBy.genre}`;
    const boxes = await httpService.get(`box`, filterBy)
    return byFilter(boxes, filterBy);
}

function byFilter(boxes, filterBy) {
    if (!boxes) return;
    if (!filterBy) return boxes;
    var BoxFilteres = [];
    if (filterBy.genre && filterBy.name) {
        boxes.forEach(box => {
            // if (box.tags.includes(filterBy.genre) && box.name.toLowerCase().includes(filterBy.name.toLowerCase())) filterBoxes.push(box);
            if (box.genre === filterBy.genre && box.name.toLowerCase().includes(filterBy.name.toLowerCase())) filterBoxes.push(box);
        })
        return BoxFilteres;
    }
    else if (filterBy.name) {
        boxes.forEach(box => {
            if (box.name.toLowerCase().includes(filterBy.name.toLowerCase())) BoxFilteres.push(box);
        })
        return BoxFilteres;
    }
    else if (filterBy.genre) {
        boxes.forEach(box => {
            if(box.genre === filterBy.genre) filterBoxes.push(box);
            // if (box.tags.includes(filterBy.genre)) filterBoxes.push(box);
        })
        return BoxFilteres;
    }

    return boxes;
}


//FOR BACKEND:
// function _buildCriteria(filterBy) {
//     const criteria = {};
//     if (filterBy.name) {
//         criteria.name = { $regex: new RegExp(filterBy.name, 'ig') }
//     }
//     if (filterBy.genre) {
//             criteria.genre = filterBy.genre;
//     }
//     return criteria;
// }

function getEmptyBox() {
    return {
        name: '',
        description: '',
        imgUrl: null,
        likedByUsers: [],
        connectedUsers: [],
        genre:'',
        createdBy: {},
        createdAt: Date.now(),
        songs: [],
        currSong: null,
        viewCount: 0
    }
}

async function save(box) {
    if (box._id) {
        return httpService.put(`box/${box._id}`, box)
    } else {
        //ADD CREATED AT AND CREATED BT YO BACKEND
        return httpService.post(`box`, box);
    }
}

function addSong(song, songs) {
    // prep for validation if song already exists
    // const idx = songs.findIndex(currSong => currSong.youtubeId = song.id.videoId)
    // if (idx === -1) {

    //     return
    // }
    const newSong = {
        id: song.id.videoId,
        youtubeId: song.id.videoId,
        title: youtubeService.titleSimplify(song.snippet.title),
        imgUrl: song.snippet.thumbnails.default,
        //TODO: add loggedin user to addedby -MATAN!!!!
        addedBy: {}
    }
    return newSong;
}

async function addLike(boxId, user) {
    const box = await getById(boxId);
    var newBox = { ...box };
    var userIdx = getIsUserLikeBox(newBox, user);
    if (userIdx === -1) {
        newBox.likedByUsers.push(user);
    } else {
        newBox.likedByUsers.splice(userIdx, 1)
    }
    save(newBox);
}

function getIsUserLikeBox(currBox, currUser) {
    return currBox.likedByUsers.findIndex(user => user.id === currUser.id)
}

async function addConnectedUser(boxId, minimalUser) {
    const box = await getById(boxId);
    const updateBox = { ...box };
    const isUserInBox = updateBox.connectedUsers.find(user => user.id === minimalUser.id)
    if (!isUserInBox) {
        updateBox.connectedUsers.push(minimalUser);
        updateBox.viewCount++;
        await save(updateBox);

        //ToDO:
        // const boxIdx = getById(minimalUser.currBoxId);
        // boxes[boxIdx].connectedUsers.splice() 
    }
}


// function _makeId(length = 6) {
//     var txt = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (var i = 0; i < length; i++) {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return txt;
// }