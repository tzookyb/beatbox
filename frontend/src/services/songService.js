import httpService from './httpService';

export const songService = {
    add,
    query,
    remove,
    getIdxById
};


// return axios.get('api/toy/?id=1223&balance=13');
// return axios.get('api/toy/?', {params: {id: 1223, balanse:13}});

var gSongs = [
    {
        title: "The Meters - Cissy Strut",
        id: "s1001",
        youtubeId: "youtubeId",
        imgUrl: "https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg",
        addedBy: {}
    },
    {
        title: "The Meters - Cissy Strut",
        id: "s1001",
        youtubeId: "youtubeId",
        imgUrl: "https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg",
        addedBy: {}
    }]




function query(boxId) {
    //   if (boxId) var queryStr = `?boxId=${boxId}`;
    //   return httpService.get(`song${queryStr || ''}`);
    return Promise.resolve(gSongs)
}

function remove(songId) {
    const songIdx = getIdxById(songId)
    gSongs.splice(songIdx, 1)
    return gSongs
    // return httpService.delete(`box/song/${songId}`);

}

function getIdxById(songId) {
    // return axios.get(`${BASE_URL}`)
    //     .then(res => res.data)
    //     .then(boxes => boxes.find(song => box._id === songId))
    return gSongs.findIdx(song => song.id === songId)
}


async function add(song) {
    const addedSong = await httpService.post(`box/song`, song);
    return addedSong
}
