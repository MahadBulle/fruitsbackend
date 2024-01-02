const express = require('express')
const router = express.Router()

const customerController = require('../Controllers/customerController')

router.get('/', customerController.customerGetData)

router.get('/:id', customerController.customerGetById)

router.post('/', customerController.customerPost)

router.put('/:id', customerController.customerUpdate)

router.delete('/:id', customerController.customerDelete)

module.exports = router
