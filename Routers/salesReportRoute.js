const express = require('express')
const router = express.Router()
const SalesReportController= require("../Controllers/salesReportController")

router.get('/', SalesReportController.GetSalesData)
router.get('/:id', SalesReportController.SpecificSale)


module.exports = router