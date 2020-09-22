const boxService = require('./box.service')
const logger = require('../../services/logger.service')

async function getBox(req, res) {
    const box = await boxService.getById(req.params.id)
    res.send(box)
}
  
async function getBoxs(req, res) {
<<<<<<< HEAD
=======
    // console.log(req.query);
>>>>>>> af5ab9c09c3547f1bb7a72243d9351639afb7d13
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
<<<<<<< HEAD
=======
    // console.log("addBox -> box", box)
>>>>>>> af5ab9c09c3547f1bb7a72243d9351639afb7d13
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