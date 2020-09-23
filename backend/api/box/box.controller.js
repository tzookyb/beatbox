const boxService = require('./box.service')
const logger = require('../../services/logger.service')

async function getBox(req, res) {
    const box = await boxService.getById(req.params.id)
    res.send(box)
}
  
async function getBoxs(req, res) {
    const boxs = await boxService.query(req.query)
    // logger.debug(boxs);
    res.send(boxs)
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

module.exports = {
    getBox,
    getBoxs,
    deleteBox,
    updateBox,
    addBox
}