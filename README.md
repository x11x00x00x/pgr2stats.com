# XBL Total Leaderboard Frontend

A modern, dark-mode frontend for visualizing XBL Total leaderboard data with interactive charts.

## Features

- **Dark Mode Design**: Modern, sleek dark theme interface
- **Top 10 Default View**: Automatically loads and displays top 10 players by kudos
- **Interactive Line Chart**: Shows kudos progression over time (daily snapshots)
- **Date-based Filtering**: Load data for specific dates and times
- **User Search**: Search for specific users by name
- **Custom Chart Selection**: Add individual users to the chart for comparison
- **Sorting Options**: Sort by kudos, rank, or name
- **Top N Selection**: View top 10, 25, 50, 100, or all players

## Installation

```bash
npm install
```

## Running the Frontend

```bash
npm start
```

This will start a local web server on port 8080. Open your browser and navigate to:
- http://localhost:8080

### Other Scripts

- `npm run dev` - Start server and automatically open in browser
- `npm run serve` - Alias for `npm start`

## API Configuration

Make sure `api2.js` is running on `http://localhost:3000` before using the frontend.

To change the API URL, edit the `API_BASE_URL` constant in `app.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## Usage

### Default View
- On page load, the top 10 players are automatically loaded and displayed
- The chart shows their kudos progression over the last 30 days

### Load Data by Date
1. Select a date using the date picker
2. Optionally select a time
3. Click "Load Date" to fetch data for that specific date/hour

### Search for a User
1. Enter a username in the "Search User" field
2. Click "Search" or press Enter
3. Results will be displayed in the table

### Add User to Chart
1. Enter a username in the "Add User to Chart" field
2. Click "Add" or press Enter
3. The user's data will be added to the line chart
4. Selected users are shown as tags below the chart
5. Click the × button on a tag to remove a user from the chart

### Sorting
- Use the "Sort By" dropdown to change how the table is sorted
- Options: Kudos (High to Low), Kudos (Low to High), Rank, Name

### Top N Selection
- Use the "Show Top" dropdown to change how many players are displayed
- Options: Top 10, 25, 50, 100, or All

### Reset
- Click "Reset to Default" to return to the initial top 10 view

## API Endpoints Used

- `GET /api/xbltotal` - Get latest data (defaults to latest sync_id)
- `GET /api/xbltotal/:date` - Get data for a specific date
- `GET /api/xbltotal?name=username` - Search for users by name

## Notes

- The chart automatically fetches historical data for the last 30 days when users are added
- Historical data loading may take a moment, especially for multiple users
- If a date has no data, it will be skipped in the chart
- The chart updates in real-time as you add or remove users

## Development

The frontend uses:
- **Chart.js** (via CDN) - For interactive charts
- **http-server** - Simple HTTP server for local development
- Vanilla JavaScript - No build process required

## Port Configuration

By default, the frontend runs on port 8080. To change the port, modify the `start` script in `package.json`:

```json
"start": "http-server -p YOUR_PORT -c-1 --cors"
```
