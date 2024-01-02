const express = require('express')
const router = express.Router()

const itemsController = require('../Controllers/itemsController')

router.get('/', itemsController.itemsGetData)

router.get('/:id', itemsController.itemGetById)

router.post('/', itemsController.itemPost)

router.put('/:id', itemsController.itemUpdate)

router.delete('/:id', itemsController.itemDelete)

module.exports = router
