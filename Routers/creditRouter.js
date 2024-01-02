const express = require('express')
const router = express.Router()

const creditController = require('../Controllers/creditController')

router.get('/', creditController.creditGetData)

router.get('/:id', creditController.creditGetById)

router.post('/', creditController.creditPost)

router.put('/:id', creditController.creditUpdate)

router.delete('/:id', creditController.creditDelete)

module.exports = router
