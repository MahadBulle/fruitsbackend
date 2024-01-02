const express = require('express')
const router = express.Router()

const paymentController = require('../Controllers/paymentController')

router.get('/', paymentController.paymentGetData)

router.get('/:id', paymentController.paymentGetById)

router.post('/', paymentController.paymentPost)

router.put('/:id', paymentController.paymentUpdate)

router.delete('/:id', paymentController.paymentDelete)

module.exports = router
