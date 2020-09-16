import httpService from './httpService';

export const boxService = {
    // query,
    getById,
    // remove,
    // save
}

var gBoxex = [

]

function getById(boxId) {
    const box = gBoxex.find(box => boxId === box._id);
    return Promise.resolve(box)
}


//TODO: change to backend mood
// async function getById(boxId) {
//     return httpService.get(`box/${boxId}`)
// }
