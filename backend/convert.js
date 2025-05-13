const fs = require('fs').promises;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');

// Connect to the SQLite database
const db = new sqlite3.Database('leaderboards.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1);
    }
});

// Define leaderboard ID ranges
const KUDOS_LEADERBOARDS = [
    ...Array.from({ length: 16 }, (_, i) => i + 2), // 2-17
    ...Array.from({ length: 4 }, (_, i) => i + 25), // 25-28
    ...Array.from({ length: 4 }, (_, i) => i + 33), // 33-36
    ...Array.from({ length: 60 }, (_, i) => i + 210) // 210-269
];
const KUDOS_WORLD_SERIES_LEADERBOARDS = Array.from({ length: 172 }, (_, i) => i + 38); // 38-209
const TIME_ATTACK_LEADERBOARDS = [
    ...Array.from({ length: 197 }, (_, i) => i + 271), // 271-467
    ...Array.from({ length: 36 }, (_, i) => i + 474) // 474-509
];

// Function to convert Unix timestamp to SQLite DATETIME format
function timestampToDatetime(timestamp) {
    return moment.unix(parseInt(timestamp)).format('YYYY-MM-DD HH:mm:ss');
}

// Function to validate and format date from JSON
function getJsonDate(entry, field) {
    const date = entry[field];
    if (!date) return null;
    return moment(date, moment.ISO_8601, true).isValid() ? moment(date).format('YYYY-MM-DD HH:mm:ss') : null;
}

// Function to insert leaderboard data
async function insertLeaderboardData(table, leaderboardId, data, timestamp) {
    const folderDate = timestampToDatetime(timestamp);
    for (const entry of data) {
        const rank = parseInt(entry.rank || 0);
        const name = entry.name || '';
        const dataDate = getJsonDate(entry, 'date') || null; // Adjust field name if different
        if (table === 'XBLTotal') {
            const kudos = parseInt(entry.score || 0);
            await dbRun(`
                INSERT OR REPLACE INTO XBLTotal 
                (leaderboard_id, rank, name, first_place_finishes, second_place_finishes, third_place_finishes, races_completed, kudos_rank, kudos, folder_date, data_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [leaderboardId, rank, name, null, null, null, null, null, kudos, folderDate, dataDate]);
        } else if (table === 'LeaderboardChallengeKudos') {
            const kudos = parseInt(entry.score || 0);
            const location = entry.location || '';
            const circuit = entry.circuit || '';
            const car = entry.car || '';
            await dbRun(`
                INSERT OR REPLACE INTO LeaderboardChallengeKudos 
                (leaderboard_id, rank, name, data_date, location, circuit, car, kudos, folder_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [leaderboardId, rank, name, dataDate, location, circuit, car, kudos, folderDate]);
        } else if (table === 'LeaderboardChallengeTime') {
            const time = entry.score || ''; // Keep as string for formatted time (e.g., "41.003")
            const location = entry.location || '';
            const circuit = entry.circuit || '';
            const car = entry.car || '';
            await dbRun(`
                INSERT OR REPLACE INTO LeaderboardChallengeTime 
                (leaderboard_id, rank, name, data_date, location, circuit, car, time, folder_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [leaderboardId, rank, name, dataDate, location, circuit, car, time, folderDate]);
        } else if (table === 'GeometryWars') {
            const hiscore = parseInt(entry.score || 0);
            await dbRun(`
                INSERT OR REPLACE INTO GeometryWars 
                (leaderboard_id, rank, name, hiscore, folder_date, data_date)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [leaderboardId, rank, name, hiscore, folderDate, dataDate]);
        } else if (table === 'Arcade') {
            const kudos = parseInt(entry.kudos || 0);
            const location = entry.location || '';
            const circuit = entry.circuit || '';
            const car = entry.car || '';
            await dbRun(`
                INSERT OR REPLACE INTO Arcade 
                (leaderboard_id, rank, name, data_date, location, circuit, car, kudos, folder_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [leaderboardId, rank, name, dataDate, location, circuit, car, kudos, folderDate]);
        } else if (table === 'KudosWorldSeries') {
            const kudos = parseInt(entry.score || 0);
            const location = entry.location || '';
            const circuit = entry.circuit || '';
            const car = entry.car || '';
            await dbRun(`
                INSERT OR REPLACE INTO KudosWorldSeries 
                (leaderboard_id, rank, name, data_date, location, circuit, car, kudos, folder_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [leaderboardId, rank, name, dataDate, location, circuit, car, kudos, folderDate]);
        } else if (table === 'TimeAttack') {
            const time = entry.score || ''; // Keep as string for formatted time (e.g., "01:12.353")
            const location = entry.location || '';
            const circuit = entry.circuit || '';
            const car = entry.car || '';
            await dbRun(`
                INSERT OR REPLACE INTO TimeAttack 
                (leaderboard_id, rank, name, data_date, location, circuit, car, time, folder_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [leaderboardId, rank, name, dataDate, location, circuit, car, time, folderDate]);
        } else if (table === 'OfflineTop10') {
            const score = parseInt(entry.score || 0);
            await dbRun(`
                INSERT OR REPLACE INTO OfflineTop10 
                (rank, name, score, folder_date, data_date)
                VALUES (?, ?, ?, ?, ?)
            `, [rank, name, score, folderDate, dataDate]);
        }
    }
}

// Function to insert counts-based data (ArcadeTotals, TimeAttackTop10, TimeAttackTop3, Top3, Top10)
async function insertCountsData(table, data, timestamp) {
    const folderDate = timestampToDatetime(timestamp);
    for (const entry of data) {
        const name = entry.name || entry.Name || '';
        const counts = entry.counts || entry.Counts || {};
        const dataDate = getJsonDate(entry, 'date') || null; // Adjust field name if different
        // Prepare counts for all possible ranks (1-10 or 1-3 depending on table)
        const countValues = {};
        for (let i = 1; i <= 10; i++) {
            countValues[`count_${i}`] = counts[i] !== undefined ? parseInt(counts[i]) : null;
        }
        if (table === 'ArcadeTotals') {
            await dbRun(`
                INSERT OR REPLACE INTO Arcade 
                (name, count_1, count_2, count_3, count_4, count_5, count_6, count_7, count_8, count_9, count_10, folder_date, data_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [name, countValues.count_1, countValues.count_2, countValues.count_3,
                countValues.count_4, countValues.count_5, countValues.count_6,
                countValues.count_7, countValues.count_8, countValues.count_9,
                countValues.count_10, folderDate, dataDate]);
        } else if (table === 'TimeAttackTop10') {
            await dbRun(`
                INSERT OR REPLACE INTO TimeAttackTop10 
                (name, count_1, count_2, count_3, count_4, count_5, count_6, count_7, count_8, count_9, count_10, folder_date, data_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [name, countValues.count_1, countValues.count_2, countValues.count_3,
                countValues.count_4, countValues.count_5, countValues.count_6,
                countValues.count_7, countValues.count_8, countValues.count_9,
                countValues.count_10, folderDate, dataDate]);
        } else if (table === 'TimeAttackTop3') {
            await dbRun(`
                INSERT OR REPLACE INTO TimeAttackTop3 
                (name, count_1, count_2, count_3, folder_date, data_date)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [name, countValues.count_1, countValues.count_2, countValues.count_3, folderDate, dataDate]);
        } else if (table === 'Top3') {
            await dbRun(`
                INSERT OR REPLACE INTO Top3 
                (name, count_1, count_2, count_3, folder_date, data_date)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [name, countValues.count_1, countValues.count_2, countValues.count_3, folderDate, dataDate]);
        } else if (table === 'Top10') {
            await dbRun(`
                INSERT OR REPLACE INTO Top10 
                (name, count_1, count_2, count_3, count_4, count_5, count_6, count_7, count_8, count_9, count_10, folder_date, data_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [name, countValues.count_1, countValues.count_2, countValues.count_3,
                countValues.count_4, countValues.count_5, countValues.count_6,
                countValues.count_7, countValues.count_8, countValues.count_9,
                countValues.count_10, folderDate, dataDate]);
        }
    }
}

// Function to insert matches data
async function insertMatchesData(leaderboardId, data, timestamp) {
    const folderDate = timestampToDatetime(timestamp);
    for (const entry of data) {
        const host = entry.host || '';
        const players = entry.players || '';
        const dataDate = getJsonDate(entry, 'date') || null; // Adjust field name if different
        await dbRun(`
            INSERT OR REPLACE INTO Matches 
            (leaderboard_id, host, players, folder_date, data_date)
            VALUES (?, ?, ?, ?, ?)
        `, [leaderboardId, host, players, folderDate, dataDate]);
    }
}

// Function to insert LatestChanges data
async function insertLatestChangesData(data, timestamp) {
    const folderDate = timestampToDatetime(timestamp);
    for (const entry of data) {
        const leaderboard = entry.leaderboard || '';
        const leaderboardIdMatch = leaderboard.match(/leaderboard_(\d{3})/);
        const leaderboardId = leaderboardIdMatch ? parseInt(leaderboardIdMatch[1]) : 0;
        const name = entry.name || '';
        const oldRank = parseInt(entry.oldRank || 0);
        const newRank = parseInt(entry.newRank || 0);
        const oldScore = parseInt(entry.oldScore || 0);
        const newScore = parseInt(entry.newScore || 0);
        const dataDate = getJsonDate(entry, 'date') || null; // Adjust field name if different
        await dbRun(`
            INSERT OR REPLACE INTO LatestChanges 
            (leaderboard_id, leaderboard, name, oldRank, newRank, oldScore, newScore, folder_date, data_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [leaderboardId, leaderboard, name, oldRank, newRank, oldScore, newScore, folderDate, dataDate]);
    }
}

// Helper function to run SQL queries
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.error(`SQL error: ${err.message} in query: ${sql}`);
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

// Main function to process files
async function processArchiveFolders() {
    const archivePath = 'api/archive';
    let dirExists;
    try {
        dirExists = await fs.access(archivePath);
    } catch {
        console.log(`Directory ${archivePath} does not exist.`);
        return;
    }

    // Loop through timestamp folders
    const timestampFolders = await fs.readdir(archivePath);
    for (const timestampFolder of timestampFolders) {
        const folderPath = path.join(archivePath, timestampFolder);
        const stat = await fs.stat(folderPath);
        if (!stat.isDirectory()) {
            continue;
        }

        let timestamp;
        try {
            timestamp = parseInt(timestampFolder);
            if (isNaN(timestamp)) {
                throw new Error('Invalid timestamp');
            }
        } catch {
            console.log(`Skipping invalid folder: ${timestampFolder}`);
            continue;
        }

        // Loop through files in the timestamp folder
        const files = await fs.readdir(folderPath);
        for (const fileName of files) {
            const filePath = path.join(archivePath, timestampFolder, fileName);
            const fileStat = await fs.stat(filePath);
            if (!fileStat.isFile()) {
                continue;
            }

            let data;
            try {
                const fileContent = await fs.readFile(filePath, 'utf8');
                data = JSON.parse(fileContent);
            } catch (e) {
                console.log(`Error reading ${filePath}: ${e.message}`);
                continue;
            }

            // Match leaderboard files
            const leaderboardMatch = fileName.match(/leaderboard_(\d{3})/);
            if (leaderboardMatch) {
                const leaderboardId = parseInt(leaderboardMatch[1]);
                if (leaderboardId === 1) {
                    await insertLeaderboardData('XBLTotal', leaderboardId, data, timestamp);
                } else if (leaderboardId === 15) {
                    await insertLeaderboardData('GeometryWars', leaderboardId, data, timestamp);
                } else if (KUDOS_WORLD_SERIES_LEADERBOARDS.includes(leaderboardId)) {
                    await insertLeaderboardData('KudosWorldSeries', leaderboardId, data, timestamp);
                } else if (TIME_ATTACK_LEADERBOARDS.includes(leaderboardId)) {
                    await insertLeaderboardData('TimeAttack', leaderboardId, data, timestamp);
                } else if (KUDOS_LEADERBOARDS.includes(leaderboardId)) {
                    await insertLeaderboardData('LeaderboardChallengeKudos', leaderboardId, data, timestamp);
                } else {
                    await insertLeaderboardData('LeaderboardChallengeTime', leaderboardId, data, timestamp);
                }
            } else if (fileName === 'arcade') {
                await insertCountsData('ArcadeTotals', data, timestamp); // Route arcade to ArcadeTotals
            } else if (fileName === 'matches') {
                await insertMatchesData(0, data, timestamp);
            } else if (fileName === 'offlinetop10') {
                await insertLeaderboardData('OfflineTop10', 0, data, timestamp);
            } else if (fileName === 'timeattacktop3' || fileName === 'timeattack top3') {
                await insertCountsData('TimeAttackTop3', data, timestamp);
            } else if (fileName === 'timeattacktop10') {
                await insertCountsData('TimeAttackTop10', data, timestamp);
            } else if (fileName === 'top3') {
                await insertCountsData('Top3', data, timestamp);
            } else if (fileName === 'top10') {
                await insertCountsData('Top10', data, timestamp);
            } else if (fileName === 'kudosworldseries') {
                await insertLeaderboardData('Arcade', 0, data, timestamp); // Route kudosworldseries to Arcade
            } else if (fileName === 'timeattack') {
                await insertLeaderboardData('TimeAttack', 0, data, timestamp);
            } else if (fileName === 'latestchanges') {
                await insertLatestChangesData(data, timestamp);
            } else {
                console.log(`Skipping unknown file: ${fileName}`);
            }
        }
    }

    console.log('Data import completed.');
}

// Run the script
(async () => {
    try {
        await processArchiveFolders();
    } catch (err) {
        console.error('Error during import:', err.message);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            }
        });
    }
})();