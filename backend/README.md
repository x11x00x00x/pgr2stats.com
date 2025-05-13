# Backend Folder Overview

This folder contains the backend logic, scripts, and database for the PGR2 Stats project. Below is a summary of the main files and their purposes:

- **api.js**: The main API server (Node.js/Express) that serves leaderboard data from the database.
- **convert.js**: Processes all old files and imports them into the database.
- **fetch.js**: Grabs leaderboard and related data from the Insignia website.
- **import.js**: Similar to `convert.js` but provides a more verbose import process.
- **old.js**: The legacy code for generating the old version of the API.
- **db.sql**: SQL schema and setup for the SQLite database.
- **leaderboards.db**: The main SQLite database file containing all leaderboard data.
- **db/**: Contains database backups and related files.
- **package.json / package-lock.json / yarn.lock**: Project dependency and lock files for Node.js. 