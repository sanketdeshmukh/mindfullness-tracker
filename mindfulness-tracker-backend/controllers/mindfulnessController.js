const MindfulnessEntry = require('../models/MindfulnessEntry');
const mongoose = require('mongoose');
const inMemoryDb = require('../inMemoryDb');

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Create or update a mindfulness entry
exports.createOrUpdateEntry = async (req, res) => {
  try {
    const { date, hour, presentPercentage, notes } = req.body;

    console.log('📝 Received entry:', { date, hour, presentPercentage, notes });

    // Validate input
    if (!date || hour === undefined || presentPercentage === undefined) {
      console.warn('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: date, hour, presentPercentage'
      });
    }

    if (presentPercentage < 0 || presentPercentage > 100) {
      console.warn('❌ Validation failed: presentPercentage out of range');
      return res.status(400).json({
        success: false,
        message: 'presentPercentage must be between 0 and 100'
      });
    }

    if (hour < 0 || hour > 23) {
      console.warn('❌ Validation failed: hour out of range');
      return res.status(400).json({
        success: false,
        message: 'hour must be between 0 and 23'
      });
    }

    // Parse date and set to start of day
    let entryDate;
    if (typeof date === 'string') {
      // Parse as YYYY-MM-DD without timezone conversion
      const [year, month, day] = date.split('-').map(Number);
      entryDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    } else {
      entryDate = new Date(date);
      entryDate.setHours(0, 0, 0, 0);
    }

    // Check that date is not in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (entryDate > today) {
      console.warn('❌ Validation failed: Cannot add entry for future dates');
      return res.status(400).json({
        success: false,
        message: 'Cannot add entries for future dates. Please select today or earlier.'
      });
    }

    console.log('💾 Saving entry for date:', entryDate.toISOString().split('T')[0], 'hour:', hour);

    let entry;
    
    if (isMongoConnected()) {
      // Use MongoDB
      entry = await MindfulnessEntry.findOneAndUpdate(
        { date: entryDate, hour: hour },
        {
          presentPercentage,
          notes: notes || '',
          updatedAt: new Date()
        },
        { new: true, upsert: true, runValidators: true }
      );
      console.log('✅ Entry saved to MongoDB:', entry);
    } else {
      // Use in-memory database
      entry = inMemoryDb.upsertEntry(entryDate, hour, presentPercentage, notes || '');
      console.log('✅ Entry saved to in-memory DB (MongoDB unavailable):', entry);
    }

    res.status(201).json({
      success: true,
      message: 'Entry saved successfully',
      data: entry,
      storage: isMongoConnected() ? 'MongoDB' : 'In-Memory (temporary)'
    });
  } catch (error) {
    console.error('🔴 Error creating/updating entry:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error saving entry',
      error: error.message
    });
  }
};

// Get entries for a specific date
exports.getEntriesByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameter: date'
      });
    }

    const queryDate = new Date(date + 'T00:00:00Z');
    
    let entries;
    if (isMongoConnected()) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      entries = await MindfulnessEntry.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ hour: 1 });
    } else {
      entries = inMemoryDb.getEntriesByDate(queryDate);
    }

    res.json({
      success: true,
      data: entries
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching entries',
      error: error.message
    });
  }
};

// Get entries for a date range
exports.getEntriesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameters: startDate, endDate'
      });
    }

    let entries;
    if (isMongoConnected()) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      entries = await MindfulnessEntry.find({
        date: { $gte: start, $lte: end }
      }).sort({ date: 1, hour: 1 });
    } else {
      const start = new Date(startDate + 'T00:00:00Z');
      const end = new Date(endDate + 'T23:59:59Z');
      entries = inMemoryDb.getEntriesByDateRange(start, end);
    }

    res.json({
      success: true,
      data: entries
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching entries',
      error: error.message
    });
  }
};

// Get daily summary (average presentPercentage per day)
exports.getDailySummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameters: startDate, endDate'
      });
    }

    let summary;
    if (isMongoConnected()) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      summary = await MindfulnessEntry.aggregate([
        {
          $match: {
            date: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' }
            },
            averagePresent: { $avg: '$presentPercentage' },
            entryCount: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
    } else {
      const start = new Date(startDate + 'T00:00:00Z');
      const end = new Date(endDate + 'T23:59:59Z');
      summary = inMemoryDb.getDailySummary(start, end);
    }

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching daily summary',
      error: error.message
    });
  }
};

// Get hourly breakdown for a specific date
exports.getHourlyBreakdown = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameter: date'
      });
    }

    let hourlyData;
    if (isMongoConnected()) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const entries = await MindfulnessEntry.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ hour: 1 });

      // Create array with all 24 hours, filling in data where available
      hourlyData = Array.from({ length: 24 }, (_, i) => {
        const entry = entries.find(e => e.hour === i);
        return {
          hour: i,
          presentPercentage: entry ? entry.presentPercentage : null,
          notes: entry ? entry.notes : ''
        };
      });
    } else {
      const queryDate = new Date(date + 'T00:00:00Z');
      hourlyData = inMemoryDb.getHourlyBreakdown(queryDate);
    }

    res.json({
      success: true,
      data: hourlyData
    });
  } catch (error) {
    console.error('Error fetching hourly breakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hourly breakdown',
      error: error.message
    });
  }
};

// Delete an entry
exports.deleteEntry = async (req, res) => {
  try {
    const { date, hour } = req.query;

    if (!date || hour === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameters: date, hour'
      });
    }

    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    let result;
    if (isMongoConnected()) {
      result = await MindfulnessEntry.findOneAndDelete({
        date: entryDate,
        hour: hour
      });
    } else {
      const queryDate = new Date(date + 'T00:00:00Z');
      result = inMemoryDb.deleteEntry(queryDate, parseInt(hour));
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting entry',
      error: error.message
    });
  }
};

// Get all entries (for debugging/admin)
exports.getAllEntries = async (req, res) => {
  try {
    let entries;
    if (isMongoConnected()) {
      entries = await MindfulnessEntry.find().sort({ date: -1, hour: -1 });
    } else {
      entries = inMemoryDb.getAllEntries();
    }
    res.json({
      success: true,
      data: entries,
      storage: isMongoConnected() ? 'MongoDB' : 'In-Memory'
    });
  } catch (error) {
    console.error('Error fetching all entries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching entries',
      error: error.message
    });
  }
};
