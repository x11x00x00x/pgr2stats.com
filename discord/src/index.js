require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const { getLatestChanges, formatChangeMessage, db } = require('./utils/leaderboardUtils');

// Configuration
const STATE_FILE = 'last_processed.json';

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
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

// Fetch new changes from database
async function fetchNewChanges() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT lc.*, 
             CASE 
               WHEN lc.leaderboard = 'GeometryWars' THEN 'Geometry Wars'
               WHEN lc.leaderboard = 'KudosWorldSeries' THEN 'Kudos World Series'
               WHEN lc.leaderboard = 'TimeAttack' THEN 'Time Attack'
               WHEN lc.leaderboard = 'XBLTotal' THEN 'Xbox Live Total'
               ELSE lc.leaderboard
             END as formatted_leaderboard
      FROM LatestChanges lc
      WHERE lc.id > ?
      ORDER BY lc.id ASC
    `;

    db.all(query, [lastProcessedId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      if (rows.length > 0) {
        const maxId = Math.max(...rows.map(row => row.id));
        lastProcessedId = maxId;
        saveLastProcessedId(maxId);
      }

      resolve(rows);
    });
  });
}

// Post changes to Discord
async function postChanges() {
  try {
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    if (!channel) {
      console.error('Could not find the specified channel');
      return;
    }

    const newChanges = await fetchNewChanges();
    if (newChanges.length === 0) {
      console.log('No new changes to post.');
      return;
    }

    for (const change of newChanges) {
      try {
        const message = formatChangeMessage(change);
        await channel.send(message);
        console.log(`Posted change ID ${change.id}`);
      } catch (error) {
        console.error(`Error posting change ID ${change.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error posting changes:', error);
  }
}

// Command to manually check latest changes
client.on('messageCreate', async (message) => {
  if (message.content === '!leaderboard') {
    try {
      const changes = await getLatestChanges();
      if (changes.length === 0) {
        await message.reply('No recent leaderboard changes found.');
        return;
      }

      for (const change of changes) {
        const message = formatChangeMessage(change);
        await message.channel.send(message);
      }
    } catch (error) {
      console.error('Error fetching leaderboard changes:', error);
      await message.reply('Error fetching leaderboard changes. Please try again later.');
    }
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  // Run immediately on start
  postChanges();
});

client.login(process.env.DISCORD_TOKEN); 