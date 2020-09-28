const fs = require('fs')
const axios = require('axios');

const API_KEY = 'AIzaSyDzlrVY5xgIReWcL92FgEkdN4Z7kym6CBg'
const DETAILS_URL = 'https://www.googleapis.com/youtube/v3/videos'

console.clear()
console.log('********************************************************************************')
const db = require('./IDANCHANGE3.json');
let newdb = [...db]

// newdb.forEach(box => {
//     delete box.likedByUsers;
//     delete box.connectedUsers;
//     console.log(box)
// })

newdb.forEach(box => {
    box.songs.forEach(async (song, idx) => {
        if (!song.hasOwnProperty('duration') || song.duration === null) {
            const duration = await getDuration(song.youtubeId)
            song.duration = duration
            console.log(song.title, song.duration)
        }
    })
})

// newdb.forEach(box => delete box.currSong)
// newdb.forEach(box => delete box.viewCount)
// newdb.forEach(box => delete box.createdAt)
// newdb.forEach(box => box.connectedUsers = [])
// delete newdb[1].songs[0]
// newdb.forEach(box => {
//     if (box.createdBy.imgUrl === 'https://res-console.cloudinary.com/daqs7x8my/thumbnails/transform/v1/image/upload//v1600700773/am9lYWR2YnB4MWl6ZTVmcnZvM2c=/drilldown') {
//         box.createdBy.imgUrl = 'https://res.cloudinary.com/daqs7x8my/image/upload/w_100,h_100,c_thumb,g_face/v1601183977/clr5fhfweew2fyaixprr.jpg'
// }
// })


async function getDuration(youtubeId, timeString) {
    let duration
    if (!timeString) {
        try {
            let res = await axios.get(`${DETAILS_URL}?id=${youtubeId}&part=contentDetails&key=${API_KEY}`);
            duration = res.data.items[0].contentDetails.duration;
        } catch (err) {
            console.log(err);
            throw err;
        }
    } else duration = timeString;
    try {
        duration = duration.substring(2);
        duration = duration.replace('M', ':');
        duration = duration.split(':')
        duration[1] = duration[1].replace('S', '');
        duration[1] = duration[1].padStart(2, '0');
        duration = duration.join(':');
        return duration.toString();
    } catch (err) {
        return null;
    }
}
setTimeout(() => { fs.writeFile('./IDANCHANGE3.json', JSON.stringify(newdb), (err) => console.log(err)) }, 10000)


// newdb = newdb.map(box => {
//     delete box.currSong
// })
// console.log("newdb", newdb)
// newdb.box = db.box.map(box => {
//     return {
//         ...box, currSong: null
//     }
// })

// newdb.box.forEach(box => { delete box._id })
// newdb.box.forEach(box => { box.connectedUsers = [] })
// console.log("newdb", newdb)






// function _makeId(length = 8) {
//     var txt = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (var i = 0; i < length; i++) {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return txt;
// }