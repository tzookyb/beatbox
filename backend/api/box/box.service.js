
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const COLL_NAME = 'box'

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection(COLL_NAME)
    try {
        const boxs = await collection.find(criteria).toArray();
        return boxs
    } catch (err) {
        console.log('ERROR: cannot find boxs')
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.name) {
        criteria.name = { $regex: new RegExp(filterBy.name, 'ig') }
    }
    if (filterBy.genre) {
        criteria.genre = filterBy.genre;
    }
    return criteria;
}

async function getById(boxId) {
    const collection = await dbService.getCollection(COLL_NAME)
    try {
        const box = await collection.findOne({ "_id": ObjectId(boxId) })
        return box
    } catch (err) {
        console.log(`ERROR: while finding user ${boxId}`)
        throw err;
    }
}

async function remove(boxId) {
    const collection = await dbService.getCollection(COLL_NAME)
    try {
        await collection.deleteOne({ "_id": ObjectId(boxId) })
    } catch (err) {
        console.log(`ERROR: cannot remove box ${boxId}`)
        throw err;
    }
}


async function update(box) {
    const collection = await dbService.getCollection(COLL_NAME)
    box._id = ObjectId(box._id);

    try {
        await collection.replaceOne({ '_id': box._id }, box)
        return box
    } catch (err) {
        console.log(`ERROR: cannot update box ${box._id}`)
        throw err;
    }
}

async function add(box) {
    const collection = await dbService.getCollection(COLL_NAME)
    try {
        await collection.insertOne(box);
        return box;
    } catch (err) {
        console.log(`ERROR: cannot insert box`)
        throw err;
    }
}


// CRUDL: Create, Read, Update, Delete, List
module.exports = {
    query,
    getById,
    add,
    update,
    remove
}
