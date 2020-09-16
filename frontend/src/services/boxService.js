import httpService from './httpService';
// import axios from 'axios';

// const BASE_URL = 'http://localhost:3030/box'

// var gBoxes = [];

export const boxService = {
    query,
    getById,
    save

    // remove,
}


// function query(filterBy) {
//     if (!filterBy) filterBy = {};
//     return axios.get(BASE_URL)
//         .then(res => res.data)
//         .then(boxes => {
//             gBoxes = boxes;
//             console.log("query -> boxes", boxes)
//             return boxes;
//         })
// }

// function getById(boxId) {
//     return gBoxes.find(box => box._id === boxId)
// }

async function save(box) {
    if (box._id) {
        return httpService.put(`box/${box._id}`, box)
    } else {
         //TODO: delete Id
        box._id = _makeId();
        return httpService.post(`box`, box)
    }
}



// //TODO: change to backend mood
async function getById(boxId) {
    return httpService.get(`box/${boxId}`)
}

async function query(filterBy) {
    var queryStr = {};
    return httpService.get(`box`)
    // return httpService.get(`toy`, { name: filterBy.name, inStock: filterBy.inStock, type: filterBy.type, sortBy })
}


function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}
