const express = require('express');
const router = express.Router();
const mindfulnessController = require('../controllers/mindfulnessController');

// POST - Create or update a mindfulness entry
router.post('/entry', mindfulnessController.createOrUpdateEntry);

// GET - Get entries for a specific date
router.get('/entries-by-date', mindfulnessController.getEntriesByDate);

// GET - Get entries for a date range
router.get('/entries-by-range', mindfulnessController.getEntriesByDateRange);

// GET - Get daily summary
router.get('/daily-summary', mindfulnessController.getDailySummary);

// GET - Get hourly breakdown for a specific date
router.get('/hourly-breakdown', mindfulnessController.getHourlyBreakdown);

// DELETE - Delete an entry
router.delete('/entry', mindfulnessController.deleteEntry);

// GET - Get all entries (admin only)
router.get('/all', mindfulnessController.getAllEntries);

module.exports = router;
