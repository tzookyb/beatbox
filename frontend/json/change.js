const fs = require('fs')

function _makeId(length = 8) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}
console.clear()
console.log('********************************************************************************')
const db = require('../db.json');
let newdb = { user: [...db.user] }
newdb.box = db.box.map(box => {
    return {
        ...box, songs: box.songs.map(song => {
            return { ...song, id: _makeId() }

        })
    }
})
fs.writeFile('./newjson.json', JSON.stringify(newdb), (err)=>console.log(err))