# Mindfulness Tracker Backend

Node.js/Express backend for the Mindfulness Tracker application with MongoDB integration.

## Setup

```bash
npm install
```

## Configuration

Create `.env` file in the root directory:

```
MONGODB_URI=mongodb://localhost:27017/mindfulness-tracker
PORT=3000
NODE_ENV=development
```

## Development

```bash
npm start
```

For development with auto-reload (requires nodemon):
```bash
npm run dev
```

## API Endpoints

### Create/Update Entry
```
POST /api/mindfulness/entry
Content-Type: application/json

{
  "date": "2024-11-17",
  "hour": 10,
  "presentPercentage": 75,
  "notes": "Good focus during morning work"
}
```

### Get Entries by Date
```
GET /api/mindfulness/entries-by-date?date=2024-11-17
```

### Get Entries by Date Range
```
GET /api/mindfulness/entries-by-range?startDate=2024-11-10&endDate=2024-11-17
```

### Get Daily Summary
```
GET /api/mindfulness/daily-summary?startDate=2024-11-10&endDate=2024-11-17
```

### Get Hourly Breakdown
```
GET /api/mindfulness/hourly-breakdown?date=2024-11-17
```

### Delete Entry
```
DELETE /api/mindfulness/entry?date=2024-11-17&hour=10
```

### Health Check
```
GET /api/health
```

## Database Schema

**MindfulnessEntry Collection:**
- `_id`: ObjectId (auto-generated)
- `date`: Date (midnight of the entry date)
- `hour`: Number (0-23)
- `presentPercentage`: Number (0-100)
- `notes`: String (optional)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-updated)

**Indexes:**
- Compound unique index on (date, hour)

## Error Handling

All endpoints return JSON with this structure:

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info"
}
```

## MongoDB Atlas Setup (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Add IP whitelist
4. Create database user
5. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`
6. Set in `.env`:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/mindfulness-tracker
```

## Local MongoDB Setup

For Windows:
```
mongod
```

For Mac:
```
brew services start mongodb-community
```

For Linux:
```
sudo systemctl start mongod
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use production MongoDB connection
3. Deploy to services like:
   - Heroku
   - Railway
   - AWS Elastic Beanstalk
   - DigitalOcean
   - Render

Example Heroku deployment:
```bash
heroku create your-app-name
heroku config:set MONGODB_URI="your-connection-string"
git push heroku main
```

## Debugging

Enable verbose logging by checking console outputs or adding debug middleware:

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

## License

MIT
