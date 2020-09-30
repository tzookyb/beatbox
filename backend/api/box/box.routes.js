
const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getBox, getBoxs, deleteBox, updateBox, addBox} = require('./box.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getBoxs)
router.post('/', addBox)
router.get('/:id', getBox)
router.put('/:id', updateBox)
router.delete('/:id', deleteBox)

module.exports = router

