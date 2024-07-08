const express = require('express');
const router = express.Router();
const reportIssueController = require('../controllers/reportIssueController');

router.post('/report', reportIssueController.reportIssue);

module.exports = router;
