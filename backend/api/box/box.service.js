
// const fs = require('fs')
// const boxs = require('../../data/box.json')
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId


// function query(filterBy) {
//     var boxsToReturn = boxs;
//     if (filterBy.q) {
//         boxsToReturn = boxsToReturn.filter(box => box.name.includes(filterBy.q))
//     }
//     if (filterBy.inStock) {
//         boxsToReturn = boxsToReturn.filter(box => box.inStock)
//     }
//     if (filterBy.type) {
//         boxsToReturn = boxsToReturn.filter(box => box.type === filterBy.type)
//     }
//     // if (filterBy.sortBy) {

//     //     boxsToReturn = boxsToReturn.sort((str1, str1) => box.type === filterBy.type)
//     // }
//     return Promise.resolve(boxsToReturn);
// }

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('box')
    try {
        const boxs = await collection.find(criteria).toArray();
        // boxs.forEach(box => delete box.password);

        return boxs
    } catch (err) {
        console.log('ERROR: cannot find boxs')
        throw err;
    }
}



// function getById(id) {
//     const box = boxs.find(box => box._id === id)
//     return Promise.resolve(box);
// }

async function getById(boxId) {
    const collection = await dbService.getCollection('box')
    try {
        const box = await collection.findOne({ "_id": ObjectId(boxId) })

        // user.givenReviews = await reviewService.query({ byUserId: ObjectId(user._id) })
        // user.givenReviews = user.givenReviews.map(review => {
        //     delete review.byUser
        //     return review
        // })
        return box
    } catch (err) {
        console.log(`ERROR: while finding user ${boxId}`)
        throw err;
    }
}

async function remove(boxId) {
    const collection = await dbService.getCollection('box')
    try {
        await collection.deleteOne({ "_id": ObjectId(boxId) })
    } catch (err) {
        console.log(`ERROR: cannot remove box ${boxId}`)
        throw err;
    }
}

// function remove(id) {
//     console.log("remove -> boxs", boxs)
//     const idx = boxs.findIndex(box => box._id === id)
//     boxs.splice(idx, 1);
//     _saveBoxsToFile()
//     return Promise.resolve();
// }

async function update(box) {
    const collection = await dbService.getCollection('box')
    box._id = ObjectId(box._id);

    try {
        await collection.replaceOne({ '_id': box._id }, box )
        console.log("update -> box", box)
        return box
    } catch (err) {
        console.log(`ERROR: cannot update box ${box._id}`)
        throw err;
    }
}

async function add(box) {
    const collection = await dbService.getCollection('box')
    try {
        await collection.insertOne(box);
        return box;
    } catch (err) {
        console.log(`ERROR: cannot insert box`)
        throw err;
    }
}

// function save(box) {
//     if (box._id) {
//         const idx = boxs.findIndex(currBox => currBox._id === box._id)
//         box.updatedAt = Date.now();
//         console.log("save -> box", box)
//         boxs[idx] = {...box}
//     } else {
//         box.createdAt = Date.now();
//         console.log("save -> box", box)
//         box._id = _makeId();
//         box.inStock = true;
//         boxs.unshift(box);
//     }
//     _saveBoxsToFile();
//     return Promise.resolve(box);
// }


// CRUDL: Create, Read, Update, Delete, List
module.exports = {
    query,
    getById,
    add,
    update,
    remove
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.q) {
        console.log("function_buildCriteria -> filterBy.name", filterBy.q)
        criteria.name= { $regex: new RegExp(filterBy.q, 'ig') }
    }
    if (filterBy.type) {
        criteria.type= filterBy.type
    }
    if (filterBy.inStock) {
        criteria.inStock = true
    }
    // if (filterBy.name) {
    //     criteria.name= new RegExp(`/${filterBy.name}/i`)
    // }
    // if (filterBy.price) {
    //     criteria.balance = { $gte: +filterBy.minBalance }
    // }
    return criteria;
}

// function _makeId(length=5) {
//     var txt = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for(var i=0; i < length; i++)  {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return txt;
// }

// function _saveBoxsToFile() {
//     fs.writeFileSync('data/box.json', JSON.stringify(boxs, null, 2));
// }
