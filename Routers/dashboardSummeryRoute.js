const express = require('express');
const router = express.Router();

const getDashboardSummary = require('../Controllers/dashboardSummeryController');

// Route for getting dashboard summary
router.get('/', getDashboardSummary.getDashboardSummary);

module.exports = router;
