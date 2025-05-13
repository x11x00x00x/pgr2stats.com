const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');

// Configuration
const TOKEN = 'YOUR_DISCORD_BOT_TOKEN'; // Replace with your bot token
const CHANNEL_ID = 'YOUR_CHANNEL_ID'; // Replace with your Discord channel ID
const API_URL = 'http://localhost:3000/api/latestchanges';
const STATE_FILE = 'last_processed.json';

// Initialize Discord client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Load or initialize last processed ID
let lastProcessedId = 0;
if (fs.existsSync(STATE_FILE)) {
    const state = JSON.parse(fs.readFileSync(STATE_FILE));
    lastProcessedId = state.lastProcessedId || 0;
}

// Save last processed ID
function saveLastProcessedId(id) {
    fs.writeFileSync(STATE_FILE, JSON.stringify({ lastProcessedId: id }));
}

// Fetch new changes from API
async function fetchNewChanges() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        
        // Filter for new records
        const newChanges = data.filter(change => change.id > lastProcessedId);
        if (newChanges.length === 0) return [];

        // Update last processed ID
        const maxId = Math.max(...newChanges.map(change => change.id));
        lastProcessedId = maxId;
        saveLastProcessedId(maxId);

        return newChanges;
    } catch (error) {
        console.error('Error fetching changes:', error);
        return [];
    }
}

// Format change data for Discord
function formatChange(change) {
    return `
**New Leaderboard Change**
Leaderboard: ${change.leaderboard}
Player: ${change.name}
Old Rank: ${change.oldRank} → New Rank: ${change.newRank}
Old Score: ${change.oldScore} → New Score: ${change.newScore}
Date: ${new Date(change.data_date).toLocaleString()}
    `.trim();
}

// Post changes to Discord
async function postChanges() {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        console.error('Channel not found!');
        return;
    }

    const newChanges = await fetchNewChanges();
    if (newChanges.length === 0) {
        console.log('No new changes to post.');
        return;
    }

    for (const change of newChanges) {
        try {
            await channel.send(formatChange(change));
            console.log(`Posted change ID ${change.id}`);
        } catch (error) {
            console.error(`Error posting change ID ${change.id}:`, error);
        }
    }
}

// Bot ready event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    // Run immediately on start
    postChanges();
    
    // Schedule to run every hour
    setInterval(postChanges, 60 * 60 * 1000);
});

// Login to Discord
client.login(TOKEN).catch(error => {
    console.error('Error logging in:', error);
});