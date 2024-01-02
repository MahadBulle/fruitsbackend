const express = require('express')
const router = express.Router()

const subCategoryController = require('../Controllers/subCategoryController')

router.get('/', subCategoryController.subCategoryGetData)

router.get('/:id', subCategoryController.subCategoryGetById)

router.post('/', subCategoryController.subCategoryPost)

router.put('/:id', subCategoryController.subCategoryUpdate)

router.delete('/:id', subCategoryController.subCategoryDelete)

module.exports = router
