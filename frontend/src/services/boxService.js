import httpService from './httpService';
// import axios from 'axios';

// const BASE_URL = 'http://localhost:3030/box'


var gGenre = ['Hip-hop', 'Arabic', 'Electronic', 'Country']
// var gGenre = ['Hip-hop', 'Arabic', 'Easy', 'Electronic', 'Country', 'Latin', 'Jazz', 'Rock',
//     'Pop', 'Classical', 'Alternative', 'Folk', 'Soul', 'Blues', 'Disco', 'Metal','Israeli']

export const boxService = {
    query,
    getById,
    getGenres,
    save,
    addSong
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
    var queryStr = filterBy;

    //In Backend: filter- only by the type if filter exist
    // return httpService.get(`box${queryStr}`)
    return httpService.get(`box`, queryStr)
    // return httpService.get(`toy`, { name: filterBy.name, inStock: filterBy.inStock, type: filterBy.type, sortBy })
}


async function save(box) {
    if (box._id) {
        return httpService.put(`box/${box._id}`, box)
    } else {
        //ADD CREATED AT AND CREATED BT YO BACKEND
        box.likedByUser = [];
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