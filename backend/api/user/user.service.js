

const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const session = require('express-session')

module.exports = {
    getByName,
    add,
    query,
    getById,
    update,
}

async function getByName(username) {
    const collection = await dbService.getCollection('user')
    try {
        const user = await collection.findOne({ username })
        return user;
    } catch (err) {
        console.log(`ERROR: while finding user ${username}`)
        throw err;
    }
}

async function add(user) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.insertOne(user);
        return user;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

async function query(filterBy = {}) {
    // const criteria = _buildCriteria(filterBy)
    const criteria = {};
    const collection = await dbService.getCollection('user')
    try {
        const users = await collection.find(criteria).toArray();
        return users
    } catch (err) {
        console.log('ERROR: cannot find users')
        throw err;
    }
}

async function getById(userId) {
    const collection = await dbService.getCollection('user')
    try {
        const user = await collection.findOne({ "_id": ObjectId(userId) })
        console.log("getById -> user", user)
        delete user.password
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${userId}`)
        throw err;
    }
}

async function update(user) {
    const oldUser = await getByName(user.username);
    const password =  oldUser.password;
    user.password = password;
    const collection = await dbService.getCollection('user')
    user._id = ObjectId(user._id);
    try {
        await collection.replaceOne({ "_id": user._id },  user)
        return user
    } catch (err) {
        console.log(`ERROR: cannot update user ${user._id}`)
        throw err;
    }
}


