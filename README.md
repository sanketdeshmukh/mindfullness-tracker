# Mindfulness Tracker App

A full-stack Angular application for tracking your mindfulness and presence throughout the day with beautiful visualizations and dark mode support.

## Features

- 📝 **Log Presence** - Track your presence percentage for each hour (10 AM - 10 PM)
- 📊 **Progress Visualization** - View hourly data for today or daily data for date ranges
- 🕐 **Time Range Selection** - Track progress over Today, Last 7 Days, 30 Days, 3 Months, 6 Months, or 1 Year
- 🌙 **Dark Mode** - Comfortable night-time viewing with automatic theme persistence
- 📱 **Mobile Friendly** - Fully responsive design optimized for iPhone and mobile devices
- 💾 **Offline-First** - In-memory database with optional MongoDB support
- 🔒 **Date Validation** - Prevents logging future dates for accuracy

## Tech Stack

### Frontend
- **Angular 15.2** - Standalone components
- **TypeScript** - Type-safe development
- **Reactive Forms** - Form validation and control
- **SVG Charts** - Custom line charts without external dependencies
- **CSS Variables** - Theme support (light/dark mode)

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** (Optional) - Data persistence
- **In-Memory Database** - Works without MongoDB

## Project Structure

```
.
├── mindfulness-tracker-frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts          # Main app component with dark mode
│   │   │   ├── components/
│   │   │   │   ├── input-form.component.ts   # Logging form
│   │   │   │   └── dashboard.component.ts    # Progress visualization
│   │   │   └── services/
│   │   │       └── mindfulness.service.ts    # API communication
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
│
└── mindfulness-tracker-backend/
    ├── server.js                    # Express server
    ├── inMemoryDb.js               # In-memory database
    ├── mindfulnessController.js    # API logic
    ├── controllers/                # Controller files
    ├── routes/                     # API routes
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Backend Setup

```bash
cd mindfulness-tracker-backend
npm install
node server.js
# Server runs on http://localhost:3000
```

### Frontend Setup

```bash
cd mindfulness-tracker-frontend
npm install
ng serve
# App runs on http://localhost:4200
```

## Usage

1. **Log Presence**
   - Go to "Log Presence" tab
   - Select date (today only)
   - Current hour is pre-selected
   - Enter presence percentage (0-100%)
   - Add optional notes
   - Click "Save Entry"

2. **View Progress**
   - Go to "View Progress" tab
   - Select a date and range
   - "Today" shows hourly data
   - Other ranges show daily data
   - Hover over data points to see exact values

3. **Dark Mode**
   - Click the 🌙 button in the top-right
   - Your preference is saved automatically

## Features in Detail

### Smart Chart Display
- **Today**: Hourly chart (10 AM - 10 PM)
- **Date Ranges**: Daily chart (7 days, 30 days, 3 months, 6 months, 1 year)
- **Interactive Tooltips**: Hover over any point to see percentage and time/date

### Sleep Hours Optimization
- Automatically excludes sleep hours (11 PM - 9 AM)
- Averages only calculated from waking hours
- Helps focus on actual mindfulness during active hours

### Mobile Responsive
- Optimized for all screen sizes
- Chart takes priority on mobile devices
- Touch-friendly interface
- iPhone 15 tested and optimized

### Data Storage
- **In-Memory**: Works instantly, data persists while server runs
- **MongoDB** (Optional): For permanent data storage across restarts
- Automatic fallback to in-memory if MongoDB unavailable

## API Endpoints

- `POST /api/mindfulness/entry` - Create/update entry
- `GET /api/mindfulness/daily-summary` - Get daily data for date range
- `GET /api/mindfulness/hourly-breakdown` - Get hourly data for a specific day
- `DELETE /api/mindfulness/entry/:date/:hour` - Delete an entry
- `GET /health` - Check backend health

## Configuration

### Environment Variables (Backend)
```
MONGODB_URI=mongodb://localhost:27017/mindfulness-tracker
PORT=3000
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Mobile App

Optimized for:
- iPhone 15 and later
- iPad
- Android devices

## Future Enhancements

- [ ] PWA support for offline access
- [ ] Data export (CSV, PDF)
- [ ] Notifications and reminders
- [ ] Weekly/monthly reports
- [ ] Social sharing
- [ ] Goals and streaks tracking

## Contributing

Feel free to fork this project and submit pull requests.

## License

MIT License

## Author

Created by Sanket Deshmukh

---

**Note**: This app is designed for personal use. All data is stored locally or in your own MongoDB instance.
