// Simple in-memory database for testing without MongoDB
class InMemoryDatabase {
  constructor() {
    this.entries = [];
    this.nextId = 1;
  }

  // Create or update an entry
  upsertEntry(date, hour, presentPercentage, notes) {
    const dateStr = date.toISOString().split('T')[0];
    const existingIndex = this.entries.findIndex(
      e => e.date.toISOString().split('T')[0] === dateStr && e.hour === hour
    );

    if (existingIndex >= 0) {
      // Update existing
      this.entries[existingIndex] = {
        ...this.entries[existingIndex],
        presentPercentage,
        notes,
        updatedAt: new Date()
      };
      return this.entries[existingIndex];
    } else {
      // Create new
      const entry = {
        _id: this.nextId++,
        date: new Date(date),
        hour,
        presentPercentage,
        notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.entries.push(entry);
      return entry;
    }
  }

  // Get entries by date range
  getEntriesByDateRange(startDate, endDate) {
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    
    return this.entries.filter(entry => {
      const entryStr = entry.date.toISOString().split('T')[0];
      return entryStr >= startStr && entryStr <= endStr;
    });
  }

  // Get entries for a specific date
  getEntriesByDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    return this.entries.filter(
      entry => entry.date.toISOString().split('T')[0] === dateStr
    );
  }

  // Get daily summary
  getDailySummary(startDate, endDate) {
    const entries = this.getEntriesByDateRange(startDate, endDate);
    const summary = {};

    entries.forEach(entry => {
      const dateStr = entry.date.toISOString().split('T')[0];
      if (!summary[dateStr]) {
        summary[dateStr] = {
          _id: dateStr,
          total: 0,
          count: 0,
          averagePresent: 0,
          entryCount: 0
        };
      }
      summary[dateStr].total += entry.presentPercentage;
      summary[dateStr].count++;
      summary[dateStr].entryCount++;
      summary[dateStr].averagePresent = Math.round(summary[dateStr].total / summary[dateStr].count * 10) / 10;
    });

    return Object.values(summary);
  }

  // Get hourly breakdown for a date
  getHourlyBreakdown(date) {
    const dateStr = date.toISOString().split('T')[0];
    const dayEntries = this.entries.filter(
      entry => entry.date.toISOString().split('T')[0] === dateStr
    );

    // Create array for all 24 hours
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      presentPercentage: null,
      date: dateStr
    }));

    // Fill in entries
    dayEntries.forEach(entry => {
      hourlyData[entry.hour] = {
        hour: entry.hour,
        presentPercentage: entry.presentPercentage,
        date: dateStr,
        notes: entry.notes
      };
    });

    return hourlyData;
  }

  // Delete an entry
  deleteEntry(date, hour) {
    const dateStr = date.toISOString().split('T')[0];
    const index = this.entries.findIndex(
      e => e.date.toISOString().split('T')[0] === dateStr && e.hour === hour
    );
    
    if (index >= 0) {
      return this.entries.splice(index, 1)[0];
    }
    return null;
  }

  // Get all entries
  getAllEntries() {
    return this.entries;
  }
}

module.exports = new InMemoryDatabase();
