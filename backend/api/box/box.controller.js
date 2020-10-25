const boxService = require('./box.service')
const logger = require('../../services/logger.service')

module.exports = {
    getBox,
    getBoxes,
    deleteBox,
    updateBox,
    addBox
}

async function getBox(req, res) {
    const box = await boxService.getById(req.params.id)
    res.send(box)
}

async function getBoxes(req, res) {
    const boxes = await boxService.query()
    res.send(boxes)
}

async function deleteBox(req, res) {
    await boxService.remove(req.params.id)
    res.end()
}

async function updateBox(req, res) {
    const box = req.body;
    await boxService.update(box)
    res.send(box)
}

async function addBox(req, res) {
    const box = req.body;
    await boxService.add(box)
    res.send(box)
}