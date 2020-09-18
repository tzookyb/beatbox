import httpService from './httpService';
// import axios from 'axios';
// const BASE_URL = 'http://localhost:3030/box'

// var gGenre = ['Hip-hop', 'Arabic', 'Electronic', 'Country']
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
    var filterBoxes = [];
    if (filterBy.genre && filterBy.name) {
        boxes.forEach(box => {
            if (box.tags.includes(filterBy.genre) && box.name.toLowerCase().includes(filterBy.name.toLowerCase())) filterBoxes.push(box);
        })
        return filterBoxes;
    }
    else if (filterBy.name) {
        boxes.forEach(box => {
            if (box.name.toLowerCase().includes(filterBy.name.toLowerCase())) filterBoxes.push(box);
        })
        return filterBoxes;
    }
    else if (filterBy.genre) {
        boxes.forEach(box => {
            if (box.tags.includes(filterBy.genre)) filterBoxes.push(box);
        })
        return filterBoxes;
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
        tags: ['Hip-hop'],
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

function addSong(song) {
    const newSong = {
        id: song.id.videoId,
        title: song.snippet.title,
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
    const isUserInStation = updateBox.connectedUsers.find(user => user.id === minimalUser.id)
    if (!isUserInStation) {
        updateBox.connectedUsers.push(minimalUser);
        updateBox.viewCount++;
        await save(updateBox);
    }
}