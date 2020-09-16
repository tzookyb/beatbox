import httpService from './httpService';
// import axios from 'axios';

// const BASE_URL = 'http://localhost:3030/box'


var gGenre = ['Hip-hop', 'Arabic', 'Easy', 'Electronic', 'Country', 'Latin', 'Jazz', 'Rock',
    'Pop', 'Classical', 'Alternative', 'Folk', 'Soul', 'Blues', 'Disco', 'Metal']

export const boxService = {
    query,
    getById,
    getGenres,
    save
    // remove,
    // save
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
        return httpService.post(`box`, box)
    }
}



function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}