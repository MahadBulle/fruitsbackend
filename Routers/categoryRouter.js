const express = require('express')
const router = express.Router()

const categoryController = require('../Controllers/categoryController')

router.get('/', categoryController.categoryGetData)

router.get('/:id', categoryController.categoryGetById)

router.post('/', categoryController.categoryPost)

router.put('/:id', categoryController.categoryUpdate)

router.delete('/:id', categoryController.categoryDelete)

module.exports = router
