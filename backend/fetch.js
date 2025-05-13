const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Constants
const DB_PATH = path.join(__dirname, 'leaderboards.db');
const url = "https://insignia.live/games/4d53004b";

// Define leaderboard ID ranges (matching import.js)
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

// Helper function to wait for table to reload
async function waitForTableToReload(page) {
    await page.waitForFunction(() => {
        const rows = document.querySelectorAll('table.table-striped tbody tr');
        return rows.length > 0;
    }, { timeout: 5000 });
}

// Helper function to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

async function fetchData() {
    // Generate a unique sync_id for this run
    const sync_id = uuidv4();
    const sync_date = new Date().toISOString();

    // Insert sync record
    const syncStmt = db.prepare('INSERT INTO Sync (sync_id, sync_date) VALUES (?, ?)');
    syncStmt.run(sync_id, sync_date);
    syncStmt.finalize();

    // Get previous data for comparison
    const previousData = new Map();
    const previousStmt = db.prepare(`
        WITH previous_sync AS (
            SELECT sync_id FROM Sync 
            WHERE id = (SELECT MAX(id) FROM Sync WHERE id != ?)
        )
        SELECT leaderboard_id, name, rank, 
            CASE 
                WHEN leaderboard_id = 1 THEN kudos
                WHEN leaderboard_id = 15 THEN (
                    SELECT hiscore FROM GeometryWars 
                    WHERE leaderboard_id = 15 
                    AND name = outer.name
                    AND sync_id = (SELECT sync_id FROM previous_sync)
                )
                WHEN leaderboard_id IN (SELECT value FROM json_each(?)) THEN kudos
                WHEN leaderboard_id IN (SELECT value FROM json_each(?)) THEN time
                ELSE NULL
            END as score
        FROM (
            SELECT leaderboard_id, name, rank, kudos, NULL as time
            FROM XBLTotal
            WHERE sync_id = (SELECT sync_id FROM previous_sync)
            UNION ALL
            SELECT leaderboard_id, name, rank, kudos, NULL as time
            FROM XBLCity
            WHERE sync_id = (SELECT sync_id FROM previous_sync)
            UNION ALL
            SELECT leaderboard_id, name, rank, NULL as kudos, NULL as time
            FROM GeometryWars
            WHERE sync_id = (SELECT sync_id FROM previous_sync)
            UNION ALL
            SELECT leaderboard_id, name, rank, kudos, NULL as time
            FROM KudosWorldSeries
            WHERE sync_id = (SELECT sync_id FROM previous_sync)
            UNION ALL
            SELECT leaderboard_id, name, rank, kudos, NULL as time
            FROM LeaderboardChallengeKudos
            WHERE sync_id = (SELECT sync_id FROM previous_sync)
            UNION ALL
            SELECT leaderboard_id, name, rank, NULL as kudos, time
            FROM LeaderboardChallengeTime
            WHERE sync_id = (SELECT sync_id FROM previous_sync)
            UNION ALL
            SELECT leaderboard_id, name, rank, NULL as kudos, time
            FROM TimeAttack
            WHERE sync_id = (SELECT sync_id FROM previous_sync)
        ) as outer
    `);

    const kudosLeaderboards = JSON.stringify(KUDOS_LEADERBOARDS);
    const timeAttackLeaderboards = JSON.stringify(TIME_ATTACK_LEADERBOARDS);
    
    previousStmt.each([sync_id, kudosLeaderboards, timeAttackLeaderboards], (err, row) => {
        if (err) {
            console.error('Error fetching previous data:', err);
            return;
        }
        previousData.set(`${row.leaderboard_id}_${row.name}`, {
            rank: row.rank,
            score: row.score
        });
    });
    previousStmt.finalize();

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    try {
        // Navigate to the URL
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log('Navigated to URL successfully');

        // Scrape matches data first
        const matchesData = await page.evaluate(() => {
            const tableData = [];
            // Select only the first table
            const firstTable = document.querySelector('table.table-striped');
            if (firstTable) {
                const rows = firstTable.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const host = row.querySelector('td:first-child')?.textContent.trim() || '';
                    const players = row.querySelector('td.text-right')?.textContent.trim() || '';
                    if (host && players) {
                        tableData.push({ host, players });
                    }
                });
            }
            return tableData;
        });

        // Insert matches data into database
        if (matchesData && matchesData.length > 0) {
            const matchesStmt = db.prepare(`
                INSERT INTO Matches (
                    host, players, folder_date, data_date, sync_id
                ) VALUES (?, ?, datetime('now'), datetime('now'), ?)
            `);

            matchesData.forEach(entry => {
                matchesStmt.run(
                    entry.host,
                    entry.players,
                    sync_id
                );
            });
            matchesStmt.finalize();
            console.log(`Inserted ${matchesData.length} matches records`);
        }

        // Get all options from the select box
        const options = await page.evaluate(() => {
            const selectElement = document.getElementById('leaderboard-select');
            return Array.from(selectElement.options).map(option => ({
                value: option.value,
                text: option.text
            }));
        });
        console.log('Found options:', options);

        // Process each leaderboard
        for (const option of options) {
            const leaderboardId = parseInt(option.value);
            console.log(`Processing leaderboard ${option.text} (ID: ${leaderboardId})`);
            
            await page.select('#leaderboard-select', option.value);
            await sleep(1000);
            await waitForTableToReload(page);

            // Function to detect changes and insert into LatestChanges
            const detectAndInsertChanges = (entry, leaderboardName) => {
                const key = `${leaderboardId}_${entry.name}`;
                const previous = previousData.get(key);
                const currentScore = entry.kudos || entry.hiscore || entry.time || 0;
                
                if (!previous) {
                    // New entry
                    const changesStmt = db.prepare(`
                        INSERT INTO LatestChanges (
                            leaderboard_id, leaderboard, name, oldRank, newRank, 
                            oldScore, newScore, folder_date, data_date, sync_id
                        ) VALUES (?, ?, ?, NULL, ?, NULL, ?, datetime('now'), datetime('now'), ?)
                    `);
                    changesStmt.run(
                        leaderboardId,
                        leaderboardName,
                        entry.name,
                        entry.rank,
                        currentScore,
                        sync_id
                    );
                    changesStmt.finalize();
                    return true; // Indicate change detected
                } else if (previous.rank !== entry.rank || previous.score !== currentScore) {
                    // Changed entry
                    const changesStmt = db.prepare(`
                        INSERT INTO LatestChanges (
                            leaderboard_id, leaderboard, name, oldRank, newRank, 
                            oldScore, newScore, folder_date, data_date, sync_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)
                    `);
                    changesStmt.run(
                        leaderboardId,
                        leaderboardName,
                        entry.name,
                        previous.rank,
                        entry.rank,
                        previous.score,
                        currentScore,
                        sync_id
                    );
                    changesStmt.finalize();
                    return true; // Indicate change detected
                }
                return false; // No changes
            };

            if (leaderboardId === 1) {
                // Handle XBLTotal table
                const leaderboardData = await page.evaluate(() => {
                    const rows = Array.from(document.querySelectorAll('table.table-striped tbody tr'));
                    if (!rows || rows.length === 0) return [];
                    
                    return rows.map(row => {
                        const cells = row.querySelectorAll('td');
                        if (!cells || cells.length < 8) return null;
                        
                        try {
                            return {
                                rank: parseInt(cells[0].textContent.trim()) || 0,
                                name: cells[1].textContent.trim() || '',
                                first_place_finishes: parseInt(cells[2].textContent.trim()) || 0,
                                second_place_finishes: parseInt(cells[3].textContent.trim()) || 0,
                                third_place_finishes: parseInt(cells[4].textContent.trim()) || 0,
                                races_completed: parseInt(cells[5].textContent.trim()) || 0,
                                kudos_rank: parseInt(cells[6].textContent.trim()) || 0,
                                kudos: parseInt(cells[7].textContent.trim()) || 0
                        };
                        } catch (error) {
                            console.error('Error parsing row:', error);
                            return null;
                        }
                    }).filter(item => item !== null);
                });

                if (leaderboardData && leaderboardData.length > 0) {
                const stmt = db.prepare(`
                    INSERT INTO XBLTotal (
                        leaderboard_id, rank, name, first_place_finishes, 
                        second_place_finishes, third_place_finishes, races_completed,
                            kudos_rank, kudos, folder_date, data_date, sync_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)
                `);

                    let hasChanges = false;
                leaderboardData.forEach(entry => {
                        if (detectAndInsertChanges(entry, 'leaderboard_001')) {
                            hasChanges = true;
                    stmt.run(
                                1,
                        entry.rank,
                        entry.name,
                        entry.first_place_finishes,
                        entry.second_place_finishes,
                        entry.third_place_finishes,
                        entry.races_completed,
                        entry.kudos_rank,
                        entry.kudos,
                                sync_id
                            );
                        }
                    });
                    if (hasChanges) {
                        stmt.finalize();
                            } else {
                        stmt.finalize();
                        console.log('No changes detected for XBLTotal');
                    }
                }
            } else if (leaderboardId >= 2 && leaderboardId <= 14) {
                // Temporarily skip XBLCity and XBLCityRaces
                console.log(`Skipping XBLCity and XBLCityRaces for leaderboard ${leaderboardId}`);
            } else if (leaderboardId === 15) {
                // Handle GeometryWars table
                const geometryWarsData = await page.evaluate(() => {
                    const rows = Array.from(document.querySelectorAll('table.table-striped tbody tr'));
                    if (!rows || rows.length === 0) return [];
                    
                    return rows.map(row => {
                        const cells = row.querySelectorAll('td');
                        if (!cells || cells.length < 3) return null;
                        
                        try {
                            return {
                                rank: parseInt(cells[0].textContent.trim()) || 0,
                                name: cells[1].textContent.trim() || '',
                                hiscore: parseInt(cells[2].textContent.trim()) || 0
                            };
                        } catch (error) {
                            console.error('Error parsing row:', error);
                            return null;
                        }
                    }).filter(item => item !== null);
                });

                if (geometryWarsData && geometryWarsData.length > 0) {
                    const stmt = db.prepare(`
                        INSERT INTO GeometryWars (
                            leaderboard_id, rank, name, hiscore, folder_date, data_date, sync_id
                        ) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'), ?)
                    `);

                    let hasChanges = false;
                    geometryWarsData.forEach(entry => {
                        if (detectAndInsertChanges(entry, 'leaderboard_015')) {
                            hasChanges = true;
                            stmt.run(
                                leaderboardId,
                                entry.rank,
                                entry.name,
                                entry.hiscore,
                                sync_id
                            );
                        }
                    });
                    if (hasChanges) {
                        stmt.finalize();
                    } else {
                        stmt.finalize();
                        console.log('No changes detected for GeometryWars');
                    }
                }
            } else if (KUDOS_WORLD_SERIES_LEADERBOARDS.includes(leaderboardId)) {
                // Handle KudosWorldSeries table
                const kudosData = await page.evaluate(() => {
                    const rows = Array.from(document.querySelectorAll('table.table-striped tbody tr'));
                    if (!rows || rows.length === 0) return [];
                    
                    return rows.map(row => {
                        const cells = row.querySelectorAll('td');
                        if (!cells || cells.length < 7) return null;
                        
                        try {
                            return {
                                rank: parseInt(cells[0].textContent.trim()) || 0,
                                name: cells[1].textContent.trim() || '',
                                date: cells[2].textContent.trim() || '',
                                location: cells[3].textContent.trim() || '',
                                circuit: cells[4].textContent.trim() || '',
                                car: cells[5].textContent.trim() || '',
                                kudos: parseInt(cells[6].textContent.trim()) || 0
                            };
                        } catch (error) {
                            console.error('Error parsing row:', error);
                            return null;
                        }
                    }).filter(item => item !== null);
                });

                if (kudosData && kudosData.length > 0) {
                    const stmt = db.prepare(`
                        INSERT INTO KudosWorldSeries (
                            leaderboard_id, rank, name, data_date, location, circuit, car, kudos, 
                            folder_date, sync_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
                    `);

                    let hasChanges = false;
                    kudosData.forEach(entry => {
                        if (detectAndInsertChanges(entry, `leaderboard_${String(leaderboardId).padStart(3, '0')}`)) {
                            hasChanges = true;
                            stmt.run(
                                leaderboardId,
                                entry.rank,
                                entry.name,
                                entry.date,
                                entry.location,
                                entry.circuit,
                                entry.car,
                                entry.kudos,
                                sync_id
                            );
                        }
                    });
                    if (hasChanges) {
                        stmt.finalize();
                    } else {
                        stmt.finalize();
                        console.log(`No changes detected for KudosWorldSeries ${leaderboardId}`);
                    }
                }
            } else if (TIME_ATTACK_LEADERBOARDS.includes(leaderboardId)) {
                // Handle TimeAttack table
                const timeData = await page.evaluate(() => {
                    const rows = Array.from(document.querySelectorAll('table.table-striped tbody tr'));
                    if (!rows || rows.length === 0) return [];
                    
                    return rows.map(row => {
                        const cells = row.querySelectorAll('td');
                        if (!cells || cells.length < 7) return null;
                        
                        try {
                            return {
                                rank: parseInt(cells[0].textContent.trim()) || 0,
                                name: cells[1].textContent.trim() || '',
                                date: cells[2].textContent.trim() || '',
                                location: cells[3].textContent.trim() || '',
                                circuit: cells[4].textContent.trim() || '',
                                car: cells[5].textContent.trim() || '',
                                time: cells[6].textContent.trim() || ''
                            };
                        } catch (error) {
                            console.error('Error parsing row:', error);
                            return null;
                        }
                    }).filter(item => item !== null);
                });

                if (timeData && timeData.length > 0) {
                    const stmt = db.prepare(`
                        INSERT INTO TimeAttack (
                            leaderboard_id, rank, name, data_date, location, circuit, car, time, 
                            folder_date, sync_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
                    `);

                    let hasChanges = false;
                    timeData.forEach(entry => {
                        if (detectAndInsertChanges(entry, `leaderboard_${String(leaderboardId).padStart(3, '0')}`)) {
                            hasChanges = true;
                            stmt.run(
                                leaderboardId,
                                entry.rank,
                                entry.name,
                                entry.date,
                                entry.location,
                                entry.circuit,
                                entry.car,
                                entry.time,
                                sync_id
                            );
                        }
                    });
                    if (hasChanges) {
                        stmt.finalize();
                    } else {
                        stmt.finalize();
                        console.log(`No changes detected for TimeAttack ${leaderboardId}`);
                    }
                }
            } else if (KUDOS_LEADERBOARDS.includes(leaderboardId)) {
                // Handle LeaderboardChallengeKudos table
                const kudosData = await page.evaluate(() => {
                    const rows = Array.from(document.querySelectorAll('table.table-striped tbody tr'));
                    if (!rows || rows.length === 0) return [];
                    
                    return rows.map(row => {
                        const cells = row.querySelectorAll('td');
                        if (!cells || cells.length < 7) return null;
                        
                        try {
                            return {
                                rank: parseInt(cells[0].textContent.trim()) || 0,
                                name: cells[1].textContent.trim() || '',
                                date: cells[2].textContent.trim() || '',
                                location: cells[3].textContent.trim() || '',
                                circuit: cells[4].textContent.trim() || '',
                                car: cells[5].textContent.trim() || '',
                                kudos: parseInt(cells[6].textContent.trim()) || 0
                            };
                        } catch (error) {
                            console.error('Error parsing row:', error);
                            return null;
                        }
                    }).filter(item => item !== null);
                });

                if (kudosData && kudosData.length > 0) {
                    const stmt = db.prepare(`
                        INSERT INTO LeaderboardChallengeKudos (
                            leaderboard_id, rank, name, data_date, location, circuit, car, kudos, 
                            folder_date, sync_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
                    `);

                    let hasChanges = false;
                    kudosData.forEach(entry => {
                        if (detectAndInsertChanges(entry, `leaderboard_${String(leaderboardId).padStart(3, '0')}`)) {
                            hasChanges = true;
                            stmt.run(
                                leaderboardId,
                                entry.rank,
                                entry.name,
                                entry.date,
                                entry.location,
                                entry.circuit,
                                entry.car,
                                entry.kudos,
                                sync_id
                            );
                        }
                    });
                    if (hasChanges) {
                        stmt.finalize();
                    } else {
                        stmt.finalize();
                        console.log(`No changes detected for LeaderboardChallengeKudos ${leaderboardId}`);
                    }
                }
            } else {
                // Handle LeaderboardChallengeTime table
                const timeData = await page.evaluate(() => {
                    const rows = Array.from(document.querySelectorAll('table.table-striped tbody tr'));
                    if (!rows || rows.length === 0) return [];
                    
                    return rows.map(row => {
                        const cells = row.querySelectorAll('td');
                        if (!cells || cells.length < 7) return null;
                        
                        try {
                            return {
                                rank: parseInt(cells[0].textContent.trim()) || 0,
                                name: cells[1].textContent.trim() || '',
                                date: cells[2].textContent.trim() || '',
                                location: cells[3].textContent.trim() || '',
                                circuit: cells[4].textContent.trim() || '',
                                car: cells[5].textContent.trim() || '',
                                time: cells[6].textContent.trim() || ''
                            };
                        } catch (error) {
                            console.error('Error parsing row:', error);
                            return null;
                        }
                    }).filter(item => item !== null);
                });

                if (timeData && timeData.length > 0) {
                    const stmt = db.prepare(`
                        INSERT INTO LeaderboardChallengeTime (
                            leaderboard_id, rank, name, data_date, location, circuit, car, time, 
                            folder_date, sync_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
                    `);

                    let hasChanges = false;
                    timeData.forEach(entry => {
                        if (detectAndInsertChanges(entry, `leaderboard_${String(leaderboardId).padStart(3, '0')}`)) {
                            hasChanges = true;
                            stmt.run(
                                leaderboardId,
                                entry.rank,
                                entry.name,
                                entry.date,
                                entry.location,
                                entry.circuit,
                                entry.car,
                                entry.time,
                                sync_id
                            );
                        }
                    });
                    if (hasChanges) {
                        stmt.finalize();
                    } else {
                stmt.finalize();
                        console.log(`No changes detected for LeaderboardChallengeTime ${leaderboardId}`);
                    }
                }
            }
        }

        await browser.close();
    } catch (error) {
        console.error('Error:', error);
        await browser.close();
    }
}

// Main function to run everything
async function runAll() {
    try {
        await fetchData();
        console.log('Data collection completed successfully');
    } catch (err) {
        console.error('Error in main process:', err);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('Database connection closed');
            }
        });
    }
}

// Run the script
runAll();