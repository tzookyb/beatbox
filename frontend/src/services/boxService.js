// // import httpService from './httpService';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/box'

export const boxService = {
    // query,
    getById,
    // remove,
    // save
}


function getById(boxId) {
    return axios.get(`${BASE_URL}`)
        .then(res => res.data)
        .then(boxes => boxes.find(box => box._id === boxId))
}

// //TODO: change to backend mood
// // async function getById(boxId) {
// //     return httpService.get(`box/${boxId}`)
// // }
