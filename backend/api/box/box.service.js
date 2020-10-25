const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const COLL_NAME = 'box'

module.exports = {
    query,
    getById,
    add,
    update,
    remove,
    resetData
}

async function query() {
    const collection = await dbService.getCollection(COLL_NAME)
    try {
        const boxes = await collection.find({}).toArray();
        return boxes
    } catch (err) {
        console.log('ERROR: cannot find boxes')

        throw err;
    }
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

async function resetData() {
    const dbData = require('../../json/database.json')
    const collection = await dbService.getCollection(COLL_NAME)
    console.log('begin reset data...')
    const startTime = Date.now();
    try {
        await collection.deleteMany({})
        dbData.forEach(async (box) => {
            box._id = ObjectId(box._id);
        })
        await collection.insertMany(dbData);
        console.log('successfully resetted demo data.')
    } catch (err) {
        console.log('failed inserting demo data', err);
    } finally {
        console.log('finished after', ((Date.now() - startTime) / 1000) + 's');
    }
}