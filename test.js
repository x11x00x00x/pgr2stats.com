const cheerio = require('cheerio');
const fs = require('fs'); // Import the file system module
const path = require('path');

const url = "https://insignia.live/games/4d53004b";

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

async function runAll() {
    try {

        await matchesOnline();
    } catch (err) {
        console.error(err);
    }
}

// Call the function to run everything
runAll();