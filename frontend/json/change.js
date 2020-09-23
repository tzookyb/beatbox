const fs = require('fs')

console.clear()
console.log('********************************************************************************')
const db = require('../db.json');
let newdb = { user: [db.user] }

console.log("newdb", newdb)
newdb.box = db.box.map(box => {
    return {
        ...box, currSong: null
    }
})

newdb.box.forEach(box => { delete box._id })
newdb.box.forEach(box => { box.connectedUsers = [] })
console.log("newdb", newdb)



// fs.writeFile('./newjson2.json', JSON.stringify(newdb), (err) => console.log(err))



// function _makeId(length = 8) {
//     var txt = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (var i = 0; i < length; i++) {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return txt;
// }