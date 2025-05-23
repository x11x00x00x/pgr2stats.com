const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs'); // Import the file system module
const path = require('path');

// Constants
const MAX_INT = 2147483647;
const VALID_RANGE_MIN = MAX_INT - 3600000; // assume max time difference is 1 hour
const VALID_RANGE_MAX = MAX_INT; // scores should be less than MAX_INT
const excludedLeaderboards = [
    ...Array.from({ length: 17 }, (_, i) => (i + 1).toString()), // 1-17
    ...Array.from({ length: 4 }, (_, i) => (25 + i).toString()), // 25-28
    ...Array.from({ length: 4 }, (_, i) => (33 + i).toString()), // 33-36
    ...Array.from({ length: 192 }, (_, i) => (38 + i).toString()), // 38-229
    ...Array.from({ length: 20 }, (_, i) => (250 + i).toString()) // 250-269
];

const url = "https://insignia.live/games/4d53004b";

async function fetchData() {
    const browser = await puppeteer.launch({
                headless: true, // Set to false for non-headless mode
                defaultViewport: null,
                args: ['--no-sandbox'] // Add the no-sandbox argument
            });
    const page = await browser.newPage();

    try {
        // Navigate to the URL
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Get all options from the select box
        const options = await page.evaluate(() => {
            const selectElement = document.getElementById('leaderboard-select');
            return Array.from(selectElement.options).map(option => ({
                value: option.value,
                text: option.text
            }));
        });

        // Iterate through each option
        for (const option of options) {
            const leaderboardValue = option.value; // This is the value we will use for the filename
            
            // Pad the leaderboardValue with leading zeros to ensure it's 3 digits, and limit to 5 digits max
            const paddedLeaderboardValue = padZero(leaderboardValue, 3).slice(-5); // Ensure it's at most 5 digits
            const filename = `leaderboard_${paddedLeaderboardValue}`; // Create filename based on padded leaderboard value

            // Check if the leaderboard is excluded
            if (excludedLeaderboards.includes(leaderboardValue)) {
                console.log(`Processing excluded leaderboard: ${option.text} (Value: ${leaderboardValue})`);

                // Select the option based on its value
                await page.select('#leaderboard-select', leaderboardValue);

                // Sleep for 1 second to ensure the selection is registered
                await sleep(1000);

                // Wait for the table to reload
                await waitForTableToReload(page);

                // Extract data from the table
                const tableData = await extractTableData(page);

                // Write the raw data to JSON file
                fs.writeFileSync('./temp/' + filename, JSON.stringify(tableData, null, 2));
                console.log(`Data saved to ${filename} without conversion.`);
            } else {
                console.log(`Processing leaderboard: ${option.text} (Value: ${leaderboardValue})`);

                // Select the option based on its value
                await page.select('#leaderboard-select', leaderboardValue);

                // Sleep for 1 second to ensure the selection is registered
                await sleep(1000);

                // Wait for the table to reload
                await waitForTableToReload(page);

                // Extract data from the table
                const tableData = await extractTableData(page);

                // Check if tableData is empty or contains errors
                if (!tableData || tableData.length === 0) {
                    // Write empty array to JSON file
                    fs.writeFileSync('./temp/' + filename, JSON.stringify([], null, 2));
                    console.log(`No data found. Created empty file: ${filename}`);
                } else {
                    // Convert scores
                    const convertedData = tableData.map(item => ({
                        ...item,
                        score: convertScore(item.score)
                    }));

                    // Write valid data to JSON file
                    fs.writeFileSync('./temp/' + filename, JSON.stringify(convertedData, null, 2));
                    console.log(`Data saved to ${filename}`);
                }
            }
        }
    } catch (error) {
        console.error(error.message);
    } finally {
        // Uncomment the line below if you want to close the browser after execution
         await browser.close();
    }
}

// Sleep function to pause execution for a specified duration
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForTableToReload(page) {
    // Wait for the table to appear and ensure that the data is loaded
    await page.waitForSelector('.table-striped', { timeout: 10000 }); // Wait for the table to appear

    // Optionally, wait for a specific condition to ensure the data is loaded
    await page.waitForFunction(() => {
        const rows = document.querySelectorAll('.table-striped tr');
        return rows.length > 1; // Assuming the first row is the header
    }, { timeout: 10000 });
}

async function extractTableData(page) {
    return await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.table-striped tr'));
        return rows.map(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 3) { // Ensure there are exactly 3 cells
                return {
                    rank: cells[0]?.innerText.trim() || null,
                    name: cells[1]?.innerText.trim() || null,
                    score: cells[2]?.innerText.trim() || null
                };
            }
            return null; // Return null for rows that do not have exactly 3 cells
        }).filter(item => item !== null); // Filter out null entries
    });
}

// Convert score to formatted time
function convertScore(score) {
    const numericScore = parseInt(score, 10);
    if (isValidLeaderboardScore(numericScore)) {
        const leaderboardScore = MAX_INT - numericScore;
        const totalSeconds = Math.floor(leaderboardScore / 1000); // total seconds
        const milliseconds = leaderboardScore % 1000; // milliseconds

        const minutes = Math.floor(totalSeconds / 60); // minutes
        const seconds = totalSeconds % 60; // remaining seconds

        // Format the time in MM:SS.MMM format
        return (minutes > 0 ? `${padZero(minutes)}:` : "") +
               `${padZero(seconds)}.${padZero(milliseconds, 3)}`;
    }
    return null; // Return null if the score is not valid
}

// Pad numbers with leading zeros
function padZero(num, length = 2) {
    return num.toString().padStart(length, "0");
}

// Check if the score is valid and in the expected range
function isValidLeaderboardScore(score) {
    return (
        !isNaN(score) && score >= VALID_RANGE_MIN && score <= VALID_RANGE_MAX
    );
}

async function matchesOnline() {
    try {
        // Fetch the HTML from the URL
        const response = await fetch(url);
        const body = await response.text();

        // Load the HTML into cheerio
        const $ = cheerio.load(body);
        const tableData = [];

        // Select only the first table
        const firstTable = $('table.table-striped').first();

        // Iterate over each row in the first table
        firstTable.find('tbody tr').each((index, element) => {
            const host = $(element).find('td').first().text().trim();
            const players = $(element).find('td.text-right').text().trim();

            // Push the extracted data into the array
            tableData.push({ host, players });
        });

        // Write the data to a JSON file
        fs.writeFileSync('./temp/matches', JSON.stringify(tableData, null, 2), 'utf-8');
        //console.log('Data has been written to tableData.json');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to process leaderboard files
async function processLeaderboardFiles(directory, type) {
    const results = type === 'score' ? {} : {};

    // Get all files in the directory
    const files = await fs.promises.readdir(directory);

    // Define regex patterns for each type
    const leaderboardPatterns = {
        score: /^leaderboard_((3[8-9]|[4-9][0-9]|1[0-9]{2}|20[0-2][0-9]|25[0-9]|26[0-9]))$/,
        timeAttack: /^leaderboard_((2[7-9][0-9])|(3[0-9]{2})|(4[0-9]{2})|(5[0-0][0-9]))$/,
        ranks: /^leaderboard_(\d+)$/,
        arcade: /^leaderboard_((2[1-6][0-9])|(27[0-9])|(28[0-9])|(29[0-9]))$/,
        liveCities: /^leaderboard_([2-9]|1[0-4])$/
    };

    for (const filename of files) {
        if (leaderboardPatterns[type].test(filename)) {
            const filePath = path.join(directory, filename);
            try {
                const data = await fs.promises.readFile(filePath, 'utf-8');
                const leaderboardData = JSON.parse(data);
                
                leaderboardData.forEach(entry => {
                    const name = entry.name;

                    if (type === 'score') {
                        const score = BigInt(entry.score);
                        if (name) {
                            if (!results[name]) {
                                results[name] = BigInt(0);
                            }
                            results[name] += score;
                        }
                    } else if (type === 'timeAttack' || type === 'ranks' || type === 'arcade') {
                        const rank = entry.rank;
                        if (name && rank) {
                            if (!results[name]) {
                                results[name] = {};
                            }
                            if (!results[name][rank]) {
                                results[name][rank] = 0;
                            }
                            results[name][rank]++;
                        }
                    } else if (type === 'liveCities') {
                        const score = BigInt(entry.score);
                        if (name) {
                            if (!results[name]) {
                                results[name] = BigInt(0);
                            }
                            results[name] += score;
                        }
                    }
                });
            } catch (error) {
                console.error(`Error processing file ${filename}:`, error);
            }
        }
    }

    return results;
}

// Function to save top scores or counts to a JSON file
function saveTop(results, type, n, filename) {
    let topResults;

    if (type === 'score' || type === 'liveCities') {
        topResults = Object.entries(results)
            .map(([name, score]) => ({ name, score }))
            .sort((a, b) => (b.score > a.score ? 1 : -1))
            .slice(0, n)
            .map((entry, index) => ({ rank: index + 1, name: entry.name, score: entry.score.toString() }));
    } else if (type === 'timeAttack' || type === 'ranks' || type === 'arcade') {
        topResults = [];

        for (const name in results) {
            const counts = results[name];
            const rankCounts = {};

            for (let rank = 1; rank <= n; rank++) {
                if (counts[rank]) {
                    rankCounts[rank] = counts[rank];
                }
            }

            if (Object.keys(rankCounts).length > 0) {
                topResults.push({
                    Name: name,
                    Counts: rankCounts,
                });
            }
        }
    }

    fs.writeFileSync(filename, JSON.stringify(topResults, null, 4));
}

// Main function for name and score
async function nameScore() {
    const directory = './temp/';
    const userScores = await processLeaderboardFiles(directory, 'score');
    saveTop(userScores, 'score', 10, './temp/offlinetop10');
}

// Main function for time attack
async function timeAttack() {
    const directory = './temp/';
    const nameCounts = await processLeaderboardFiles(directory, 'timeAttack');
    saveTop(nameCounts, 'timeAttack', 10, './temp/timeattacktop10');
    saveTop(nameCounts, 'timeAttack', 3, './temp/timeattacktop3');
}

// Main function for name ranks
async function nameRanks() {
    const directory = './temp/';
    const nameCounts = await processLeaderboardFiles(directory, 'ranks');
    saveTop(nameCounts, 'ranks', 10, './temp/top10');
    saveTop(nameCounts, 'ranks', 3, './temp/top3');
}

// Main function for arcade leaderboard
async function arcadeLeaderboard() {
    const directory = './temp/';
    const nameCounts = await processLeaderboardFiles(directory, 'arcade');
    saveTop(nameCounts, 'arcade', 10, './temp/arcade');
}

// Main function for live cities leaderboard
async function liveCitiesLeaderboard() {
    const directory = './temp/';
    const userScores = await processLeaderboardFiles(directory, 'liveCities');
    saveTop(userScores, 'liveCities', 10, './temp/livecities');
}


// Function to move files to a specified directory, optionally with a timestamped folder
function moveFiles(fromDir, toDir, useTimestampedFolder = false) {
    return new Promise((resolve, reject) => {
        let folderPath = toDir;

        // Create a timestamped folder if required
        if (useTimestampedFolder) {
            const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
            folderPath = path.join(toDir, `${timestamp}`);
        }

        // Create the new folder in the destination directory
        fs.mkdir(folderPath, { recursive: true }, (err) => {
            if (err) {
                console.error(`Error creating folder: ${err}`);
                return reject(err);
            }
            console.log(`Folder created: ${folderPath}`);

            // Read files from the source directory
            fs.readdir(fromDir, (err, files) => {
                if (err) {
                    console.error(`Error reading directory: ${err}`);
                    return reject(err);
                }

                const movePromises = files.map(file => {
                    return new Promise((resolveFile, rejectFile) => {
                        const filePath = path.join(fromDir, file);

                        // Check if it's a file (not a directory)
                        fs.stat(filePath, (err, stats) => {
                            if (err) {
                                console.error(`Error getting stats for file: ${err}`);
                                return rejectFile(err);
                            }

                            if (stats.isFile()) {
                                const newFilePath = path.join(folderPath, file);
                                fs.rename(filePath, newFilePath, (err) => {
                                    if (err) {
                                        console.error(`Error moving file ${file}: ${err}`);
                                        return rejectFile(err);
                                    } else {
                                        console.log(`Moved file ${file} to ${folderPath}`);
                                        return resolveFile();
                                    }
                                });
                            } else {
                                return resolveFile(); // Resolve for directories or other types
                            }
                        });
                    });
                });

                // Wait for all move promises to resolve
                Promise.all(movePromises)
                    .then(() => resolve())
                    .catch(err => reject(err));
            });
        });
    });
}

// Function to read leaderboard files from a directory
const readLeaderboardFiles = (dir) => {
    const files = fs.readdirSync(dir);
    const jsonData = {};
  
    // Regex to match leaderboard files
    const leaderboardRegex = /^leaderboard_(\d{3})$/;
  
    files.forEach(file => {
      if (leaderboardRegex.test(file)) {
        const filePath = path.join(dir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        jsonData[file] = data;
      }
    });
  
    return jsonData;
  };
  
  // Function to get the latest archived folder
  function getLatestArchivedFolder() {
    const archiveDir = path.join(__dirname, 'api', 'archive');
    if (!fs.existsSync(archiveDir)) {
        return null;
    }
    
    const folders = fs.readdirSync(archiveDir)
        .filter(folder => fs.statSync(path.join(archiveDir, folder)).isDirectory())
        .map(folder => parseInt(folder))
        .filter(num => !isNaN(num));
    
    if (folders.length === 0) {
        return null;
    }
    
    const latestFolder = Math.max(...folders).toString();
    return path.join(archiveDir, latestFolder);
  }
  
  const findChanges = (oldData, newData, newFileName) => {
    const changes = [];
  
    // Check for new or updated entries in the latest data
    newData.forEach((newEntry, name) => {
      const oldEntry = oldData.get(name);
      if (!oldEntry) {
        // New entry in the leaderboard
        changes.push({
          leaderboard: newFileName,
          name: name,
          oldRank: null,
          newRank: newEntry.rank,
          oldScore: null,
          newScore: newEntry.score
        });
      } else {
        // Convert scores to numbers for accurate comparison
        const oldScoreNum = parseFloat(oldEntry.score);
        const newScoreNum = parseFloat(newEntry.score);
  
        // Only include if score or rank changed
        if (oldScoreNum !== newScoreNum || oldEntry.rank !== newEntry.rank) {
          changes.push({
            leaderboard: newFileName,
            name: name,
            oldRank: oldEntry.rank,
            newRank: newEntry.rank,
            oldScore: oldEntry.score,
            newScore: newEntry.score
          });
        }
      }
    });
  
    return changes;
  };
  
  // Function to get the current 24-hour period timestamp
  function getCurrentPeriodTimestamp() {
    const now = new Date();
    const periodStart = new Date(now);
    periodStart.setHours(0, 0, 0, 0);
    return Math.floor(periodStart.getTime() / 1000);
  }
  
  // Function to get the previous period timestamp
  function getPreviousPeriodTimestamp() {
    const currentPeriod = getCurrentPeriodTimestamp();
    return currentPeriod - 86400; // Subtract 24 hours in seconds
  }
  
  // Function to get the period folder path
  function getPeriodFolderPath(timestamp) {
    return path.join(__dirname, 'api', 'changes', timestamp.toString());
  }
  
  // Function to ensure period folder exists
  function ensurePeriodFolder(timestamp) {
    const folderPath = getPeriodFolderPath(timestamp);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    return folderPath;
  }
  
  // Function to find score changes (ignoring rank-only changes)
  function findScoreChanges(oldData, newData, fileName) {
    const changes = [];
    
    // Check for new or updated entries in the latest data
    newData.forEach((newEntry, name) => {
        const oldEntry = oldData.get(name);
        if (!oldEntry) {
            // New entry in the leaderboard
            changes.push({
                leaderboard: fileName,
                name: name,
                oldScore: null,
                newScore: newEntry.score
            });
        } else {
            // Only include if score changed
            if (oldEntry.score !== newEntry.score) {
                changes.push({
                    leaderboard: fileName,
                    name: name,
                    oldScore: oldEntry.score,
                    newScore: newEntry.score
                });
            }
        }
    });
    
    return changes;
  }

  // Function to find all changes (including rank changes)
  function findAllChanges(oldData, newData, fileName) {
    const changes = [];
    
    // Check for new or updated entries in the latest data
    newData.forEach((newEntry, name) => {
        const oldEntry = oldData.get(name);
        if (!oldEntry) {
            // New entry in the leaderboard
            changes.push({
                leaderboard: fileName,
                name: name,
                oldRank: null,
                newRank: newEntry.rank,
                oldScore: null,
                newScore: newEntry.score
            });
        } else {
            // Include if either score or rank changed
            if (oldEntry.score !== newEntry.score || oldEntry.rank !== newEntry.rank) {
                changes.push({
                    leaderboard: fileName,
                    name: name,
                    oldRank: oldEntry.rank,
                    newRank: newEntry.rank,
                    oldScore: oldEntry.score,
                    newScore: newEntry.score
                });
            }
        }
    });
    
    return changes;
  }

  // Modified compileChanges function to handle both score changes and all changes
  const compileChanges = () => {
    const apiDirPath = path.join(__dirname, 'api');
    const currentPeriod = getCurrentPeriodTimestamp();
    const previousPeriod = getPreviousPeriodTimestamp();
    
    // Ensure the current period folder exists
    const currentPeriodFolder = ensurePeriodFolder(currentPeriod);
    
    // Read latest leaderboard data from /api/
    const latestJsonData = readLeaderboardFiles(apiDirPath);
    
    // Get the latest archived data for comparison
    const latestArchivedFolder = getLatestArchivedFolder();
    let previousJsonData = {};
    
    if (latestArchivedFolder) {
        previousJsonData = readLeaderboardFiles(latestArchivedFolder);
    }
    
    const allChanges = [];
    const scoreChanges = [];
    
    // Compare each leaderboard file in the latest data with the corresponding file in the archived data
    for (const [fileName, latestData] of Object.entries(latestJsonData)) {
        const archivedData = previousJsonData[fileName];
        
        if (archivedData) {
            const latestDataMap = new Map(latestData.map(entry => [entry.name, { score: entry.score, rank: entry.rank }]));
            const archivedDataMap = new Map(archivedData.map(entry => [entry.name, { score: entry.score, rank: entry.rank }]));
            
            // Get all changes (including rank changes)
            const fileAllChanges = findAllChanges(archivedDataMap, latestDataMap, fileName);
            allChanges.push(...fileAllChanges);
            
            // Get only score changes
            const fileScoreChanges = findScoreChanges(archivedDataMap, latestDataMap, fileName);
            scoreChanges.push(...fileScoreChanges);
        } else {
            // If no previous data exists, consider all entries as new
            latestData.forEach(entry => {
                allChanges.push({
                    leaderboard: fileName,
                    name: entry.name,
                    oldRank: null,
                    newRank: entry.rank,
                    oldScore: null,
                    newScore: entry.score
                });
                scoreChanges.push({
                    leaderboard: fileName,
                    name: entry.name,
                    oldScore: null,
                    newScore: entry.score
                });
            });
        }
    }
    
    // Write all changes to the current period's changes file
    const changesFilePath = path.join(currentPeriodFolder, 'changes.json');
    fs.writeFileSync(changesFilePath, JSON.stringify(allChanges, null, 2));
    console.log(`All changes compiled and saved to ${changesFilePath}`);
    
    // Write only score changes to latestchanges.json
    const latestChangesPath = path.join(apiDirPath, 'latestchanges.json');
    fs.writeFileSync(latestChangesPath, JSON.stringify(scoreChanges, null, 2));
    console.log(`Score changes saved to ${latestChangesPath}`);
    
    // Clean up old period folders (older than 7 days)
    const sevenDaysAgo = currentPeriod - (7 * 86400);
    const changesDir = path.join(__dirname, 'api', 'changes');
    if (fs.existsSync(changesDir)) {
        const folders = fs.readdirSync(changesDir);
        folders.forEach(folder => {
            const folderTimestamp = parseInt(folder);
            if (folderTimestamp < sevenDaysAgo) {
                const folderPath = path.join(changesDir, folder);
                fs.rmSync(folderPath, { recursive: true, force: true });
                console.log(`Cleaned up old period folder: ${folder}`);
            }
        });
    }
  };

// Define the source and destination directories
const fromDir = path.join(__dirname, '/api/'); // Source folder for archiving
const toDir = path.join(__dirname, '/api/archive/'); // Destination folder for archiving
const fromTempDir = path.join(__dirname, '/temp'); // Source folder for temp
const toTempDir = path.join(__dirname, '/api'); // Destination folder for API

async function runAll() {
    try {
        // Fetch the data and wait for it to complete
        await fetchData(); // Just await fetchData without assigning to a variable
       // sleep(600);
        // Now that the data is fetched, run the other functions
        await matchesOnline();
        await nameScore();
        await timeAttack();
        await nameRanks();
        await arcadeLeaderboard();
        await liveCitiesLeaderboard();

        // Run the processes in sequence
        await moveFiles(fromDir, toDir, true) // Move files to archive with timestamped folder
        .then(() => moveFiles(fromTempDir, toTempDir, false)).then(() => compileChanges()) // Move files to API folder
        .catch(err => console.error(`Error during file operations: ${err}`));
    } catch (err) {
        console.error(err);
    }
}

function getFolderNames() {
  const dirPath = path.join(__dirname, 'api', 'archive');
  const dirPath2 = path.join(__dirname, 'api');
  const dirPath3 = path.join(__dirname, 'temp');
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    const folders = files
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    fs.writeFileSync(dirPath2 + '/dates', JSON.stringify(folders, null, 2));
    fs.writeFileSync(dirPath3 + '/dates', JSON.stringify(folders, null, 2));
    console.log('Folder names written to dates.json');
    return folders;
  } catch (err) {
    console.error('Error reading directory or writing file:', err);
    return [];
  }
}

getFolderNames();

// Call the function to run everything
runAll();