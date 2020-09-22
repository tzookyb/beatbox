
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



// function addBoxRoutes(app) {

//     // GET LIST
//     app.get('/api/box', (req, res) => {
//         const filterBy = req.query;
//         boxService.query(filterBy)
//             .then(boxs => {
//                 res.json(boxs)
//             })
//     })


//     // GET SINGLE
//     app.get('/api/box/:id', (req, res) => {
//         const boxId = req.params.id;
//         boxService.getById(boxId)
//             .then(box => {
//                 res.json(box)
//             })
//     })

//     // DELETE

//     app.delete('/api/box/:id', (req, res) => {
//         const boxId = req.params.id;
//         boxService.remove(boxId)
//             .then(() => {
//                 res.end('Done!')
//             })
//             .catch(() =>{
//                 res.status(403).send('not authorizd')
//             })
//     })

//     // CREATE
//     app.post('/api/box', (req, res) => {
//         const box = req.body;
//         boxService.save(box)
//             .then(savedBox => {
//                 res.json(savedBox)
//             })
//     })


//     // UPDATE
//     app.put('/api/box/:id', (req, res) => {
//         const box = req.body;
//         boxService.save(box)
//             .then(savedBox => {
//                 res.json(savedBox)
//             })
//     })

// }
// module.exports = addBoxRoutes;