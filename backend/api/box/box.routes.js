const express = require('express')
const { getBox, getBoxes, deleteBox, updateBox, addBox } = require('./box.controller')
const router = express.Router()

router.get('/', getBoxes)
router.post('/', addBox)
router.get('/:id', getBox)
router.put('/:id', updateBox)
router.delete('/:id', deleteBox)

module.exports = router