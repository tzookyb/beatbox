const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const session = require('express-session')

module.exports = {
    add,
    getByName,
    query,
    getById,
    update,
}

async function add(newUser) {
    const collection = await dbService.getCollection('user')
    try {
        await collection.insertOne(newUser);
        return newUser;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
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

async function query(filterBy = {}) {
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
        delete user.password
        return user
    } catch (err) {
        console.log(`ERROR: getById - while finding user ${userId}`)
        throw err;
    }
}

async function update(user) {
    const oldUser = await getByName(user.username);
    user.password = oldUser.password;
    const collection = await dbService.getCollection('user')
    user._id = ObjectId(user._id);
    try {
        await collection.replaceOne({ "_id": user._id }, user)
        return user
    } catch (err) {
        console.log(`ERROR: cannot update user ${user._id}`)
        throw err;
    }
}