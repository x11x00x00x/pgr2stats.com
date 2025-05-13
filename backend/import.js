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

// Helper function to run SQL queries with transaction
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            db.run(sql, params, function (err) {
                if (err) {
                    db.run('ROLLBACK');
                    console.error(`SQL error: ${err.message} in query: ${sql}`);
                    resolve({ error: err, sql: sql });
                } else {
                    db.run('COMMIT');
                    resolve(this);
                }
            });
        });
    });
}

// Function to insert leaderboard data
async function insertLeaderboardData(table, leaderboardId, data, timestamp) {
    try {
        const folderDate = timestampToDatetime(timestamp);
        const values = [];
        const placeholders = [];

        for (const entry of data) {
            try {
                const rank = parseInt(entry.rank || 0);
                const name = entry.name || '';
                const dataDate = getJsonDate(entry, 'date') || null;

                if (table === 'XBLTotal') {
                    const kudos = parseInt(entry.score || 0);
                    values.push([leaderboardId, rank, name, null, null, null, null, null, kudos, folderDate, dataDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
                } else if (table === 'LeaderboardChallengeKudos') {
                    const kudos = parseInt(entry.score || 0);
                    const location = entry.location || '';
                    const circuit = entry.circuit || '';
                    const car = entry.car || '';
                    values.push([leaderboardId, rank, name, dataDate, location, circuit, car, kudos, folderDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?)');
                } else if (table === 'LeaderboardChallengeTime') {
                    const time = entry.score || '';
                    const location = entry.location || '';
                    const circuit = entry.circuit || '';
                    const car = entry.car || '';
                    values.push([leaderboardId, rank, name, dataDate, location, circuit, car, time, folderDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?)');
                } else if (table === 'GeometryWars') {
                    const hiscore = parseInt(entry.score || 0);
                    values.push([leaderboardId, rank, name, hiscore, folderDate, dataDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?)');
                } else if (table === 'Arcade') {
                    const kudos = parseInt(entry.kudos || 0);
                    const location = entry.location || '';
                    const circuit = entry.circuit || '';
                    const car = entry.car || '';
                    values.push([leaderboardId, rank, name, dataDate, location, circuit, car, kudos, folderDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?)');
                } else if (table === 'KudosWorldSeries') {
                    const kudos = parseInt(entry.score || 0);
                    const location = entry.location || '';
                    const circuit = entry.circuit || '';
                    const car = entry.car || '';
                    values.push([leaderboardId, rank, name, dataDate, location, circuit, car, kudos, folderDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?)');
                } else if (table === 'TimeAttack') {
                    const time = entry.score || '';
                    const location = entry.location || '';
                    const circuit = entry.circuit || '';
                    const car = entry.car || '';
                    values.push([leaderboardId, rank, name, dataDate, location, circuit, car, time, folderDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?)');
                } else if (table === 'OfflineTop10') {
                    const score = parseInt(entry.score || 0);
                    values.push([rank, name, score, folderDate, dataDate]);
                    placeholders.push('(?, ?, ?, ?, ?)');
                }
            } catch (entryError) {
                console.error(`Error processing entry in ${table}:`, entryError);
                continue;
            }
        }

        if (values.length === 0) return;

        let sql;
        switch (table) {
            case 'XBLTotal':
                sql = `INSERT OR REPLACE INTO XBLTotal (leaderboard_id, rank, name, first_place_finishes, second_place_finishes, third_place_finishes, races_completed, kudos_rank, kudos, folder_date, data_date) VALUES ${placeholders.join(',')}`;
                break;
            case 'LeaderboardChallengeKudos':
                sql = `INSERT OR REPLACE INTO LeaderboardChallengeKudos (leaderboard_id, rank, name, data_date, location, circuit, car, kudos, folder_date) VALUES ${placeholders.join(',')}`;
                break;
            case 'LeaderboardChallengeTime':
                sql = `INSERT OR REPLACE INTO LeaderboardChallengeTime (leaderboard_id, rank, name, data_date, location, circuit, car, time, folder_date) VALUES ${placeholders.join(',')}`;
                break;
            case 'GeometryWars':
                sql = `INSERT OR REPLACE INTO GeometryWars (leaderboard_id, rank, name, hiscore, folder_date, data_date) VALUES ${placeholders.join(',')}`;
                break;
            case 'Arcade':
                sql = `INSERT OR REPLACE INTO Arcade (leaderboard_id, rank, name, data_date, location, circuit, car, kudos, folder_date) VALUES ${placeholders.join(',')}`;
                break;
            case 'KudosWorldSeries':
                sql = `INSERT OR REPLACE INTO KudosWorldSeries (leaderboard_id, rank, name, data_date, location, circuit, car, kudos, folder_date) VALUES ${placeholders.join(',')}`;
                break;
            case 'TimeAttack':
                sql = `INSERT OR REPLACE INTO TimeAttack (leaderboard_id, rank, name, data_date, location, circuit, car, time, folder_date) VALUES ${placeholders.join(',')}`;
                break;
            case 'OfflineTop10':
                sql = `INSERT OR REPLACE INTO OfflineTop10 (rank, name, score, folder_date, data_date) VALUES ${placeholders.join(',')}`;
                break;
        }

        const result = await dbRun(sql, values.flat());
        if (result.error) {
            console.error(`Error inserting data into ${table}:`, result.error);
        }
    } catch (error) {
        console.error(`Error in insertLeaderboardData for ${table}:`, error);
    }
}

// Function to insert counts-based data
async function insertCountsData(table, data, timestamp) {
    try {
        const folderDate = timestampToDatetime(timestamp);
        const values = [];
        const placeholders = [];

        for (const entry of data) {
            try {
                const name = entry.name || entry.Name || '';
                const counts = entry.counts || entry.Counts || {};
                const dataDate = getJsonDate(entry, 'date') || null;
                const countValues = {};
                for (let i = 1; i <= 10; i++) {
                    countValues[`count_${i}`] = counts[i] !== undefined ? parseInt(counts[i]) : null;
                }

                if (table === 'ArcadeTotals') {
                    values.push([name, countValues.count_1, countValues.count_2, countValues.count_3,
                        countValues.count_4, countValues.count_5, countValues.count_6,
                        countValues.count_7, countValues.count_8, countValues.count_9,
                        countValues.count_10, folderDate, dataDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
                } else if (table === 'TimeAttackTop10') {
                    values.push([name, countValues.count_1, countValues.count_2, countValues.count_3,
                        countValues.count_4, countValues.count_5, countValues.count_6,
                        countValues.count_7, countValues.count_8, countValues.count_9,
                        countValues.count_10, folderDate, dataDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
                } else if (table === 'TimeAttackTop3') {
                    values.push([name, countValues.count_1, countValues.count_2, countValues.count_3, folderDate, dataDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?)');
                } else if (table === 'Top3') {
                    values.push([name, countValues.count_1, countValues.count_2, countValues.count_3, folderDate, dataDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?)');
                } else if (table === 'Top10') {
                    values.push([name, countValues.count_1, countValues.count_2, countValues.count_3,
                        countValues.count_4, countValues.count_5, countValues.count_6,
                        countValues.count_7, countValues.count_8, countValues.count_9,
                        countValues.count_10, folderDate, dataDate]);
                    placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
                }
            } catch (entryError) {
                console.error(`Error processing entry in ${table}:`, entryError);
                continue;
            }
        }

        if (values.length === 0) return;

        let sql;
        switch (table) {
            case 'ArcadeTotals':
                sql = `INSERT OR REPLACE INTO Arcade (name, count_1, count_2, count_3, count_4, count_5, count_6, count_7, count_8, count_9, count_10, folder_date, data_date) VALUES ${placeholders.join(',')}`;
                break;
            case 'TimeAttackTop10':
                sql = `INSERT OR REPLACE INTO TimeAttackTop10 (name, count_1, count_2, count_3, count_4, count_5, count_6, count_7, count_8, count_9, count_10, folder_date, data_date) VALUES ${placeholders.join(',')}`;
                break;
            case 'TimeAttackTop3':
                sql = `INSERT OR REPLACE INTO TimeAttackTop3 (name, count_1, count_2, count_3, folder_date, data_date) VALUES ${placeholders.join(',')}`;
                break;
            case 'Top3':
                sql = `INSERT OR REPLACE INTO Top3 (name, count_1, count_2, count_3, folder_date, data_date) VALUES ${placeholders.join(',')}`;
                break;
            case 'Top10':
                sql = `INSERT OR REPLACE INTO Top10 (name, count_1, count_2, count_3, count_4, count_5, count_6, count_7, count_8, count_9, count_10, folder_date, data_date) VALUES ${placeholders.join(',')}`;
                break;
        }

        const result = await dbRun(sql, values.flat());
        if (result.error) {
            console.error(`Error inserting data into ${table}:`, result.error);
        }
    } catch (error) {
        console.error(`Error in insertCountsData for ${table}:`, error);
    }
}

// Function to insert matches data
async function insertMatchesData(leaderboardId, data, timestamp) {
    try {
        const folderDate = timestampToDatetime(timestamp);
        const values = [];
        const placeholders = [];

        for (const entry of data) {
            try {
                const host = entry.host || '';
                const players = entry.players || '';
                const dataDate = getJsonDate(entry, 'date') || null;
                values.push([leaderboardId, host, players, folderDate, dataDate]);
                placeholders.push('(?, ?, ?, ?, ?)');
            } catch (entryError) {
                console.error('Error processing match entry:', entryError);
                continue;
            }
        }

        if (values.length === 0) return;

        const sql = `INSERT OR REPLACE INTO Matches (leaderboard_id, host, players, folder_date, data_date) VALUES ${placeholders.join(',')}`;
        const result = await dbRun(sql, values.flat());
        if (result.error) {
            console.error('Error inserting matches data:', result.error);
        }
    } catch (error) {
        console.error('Error in insertMatchesData:', error);
    }
}

// Function to insert LatestChanges data
async function insertLatestChangesData(data, timestamp) {
    try {
        const folderDate = timestampToDatetime(timestamp);
        const values = [];
        const placeholders = [];

        for (const entry of data) {
            try {
                const leaderboard = entry.leaderboard || '';
                const leaderboardIdMatch = leaderboard.match(/leaderboard_(\d{3})/);
                const leaderboardId = leaderboardIdMatch ? parseInt(leaderboardIdMatch[1]) : 0;
                const name = entry.name || '';
                const oldRank = parseInt(entry.oldRank || 0);
                const newRank = parseInt(entry.newRank || 0);
                const oldScore = parseInt(entry.oldScore || 0);
                const newScore = parseInt(entry.newScore || 0);
                const dataDate = getJsonDate(entry, 'date') || null;
                values.push([leaderboardId, leaderboard, name, oldRank, newRank, oldScore, newScore, folderDate, dataDate]);
                placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?)');
            } catch (entryError) {
                console.error('Error processing latest changes entry:', entryError);
                continue;
            }
        }

        if (values.length === 0) return;

        const sql = `INSERT OR REPLACE INTO LatestChanges (leaderboard_id, leaderboard, name, oldRank, newRank, oldScore, newScore, folder_date, data_date) VALUES ${placeholders.join(',')}`;
        const result = await dbRun(sql, values.flat());
        if (result.error) {
            console.error('Error inserting latest changes data:', result.error);
        }
    } catch (error) {
        console.error('Error in insertLatestChangesData:', error);
    }
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
    let totalFiles = 0;
    let processedFiles = 0;

    // First count total files
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

        const files = await fs.readdir(folderPath);
        totalFiles += files.length;
    }

    console.log(`Total files to process: ${totalFiles}`);

    // Now process files
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
                processedFiles++;
                console.log(`Progress: ${processedFiles}/${totalFiles}`);
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
                await insertCountsData('ArcadeTotals', data, timestamp);
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
                await insertLeaderboardData('Arcade', 0, data, timestamp);
            } else if (fileName === 'timeattack') {
                await insertLeaderboardData('TimeAttack', 0, data, timestamp);
            } else if (fileName === 'latestchanges') {
                await insertLatestChangesData(data, timestamp);
            } else {
                console.log(`Skipping unknown file: ${fileName}`);
            }
            processedFiles++;
            console.log(`Progress: ${processedFiles}/${totalFiles}`);
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