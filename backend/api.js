const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database('leaderboards.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Helper function to execute queries
const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Arcade Endpoints
app.get('/api/arcade', async (req, res) => {
    try {
        const { name, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM Arcade';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/arcade/:id', async (req, res) => {
    try {
        const rows = await runQuery('SELECT * FROM Arcade WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GeometryWars Endpoints
app.get('/api/geometrywars', async (req, res) => {
    try {
        const { name, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM GeometryWars';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/geometrywars/:id', async (req, res) => {
    try {
        const rows = await runQuery('SELECT * FROM GeometryWars WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// KudosWorldSeries Endpoints
app.get('/api/kudosworldseries', async (req, res) => {
    try {
        const { name, folder_date, data_date, leaderboard_id } = req.query;
        let query = 'SELECT * FROM KudosWorldSeries';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (leaderboard_id) {
            conditions.push('leaderboard_id = ?');
            params.push(leaderboard_id);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LatestChanges Endpoints
app.get('/api/latestchanges', async (req, res) => {
    try {
        const { name, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM LatestChanges';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LeaderboardChallengeKudos Endpoints
app.get('/api/leaderboardchallengekudos', async (req, res) => {
    try {
        const { name, folder_date, data_date, leaderboard_id } = req.query;
        let query = 'SELECT * FROM LeaderboardChallengeKudos';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (leaderboard_id) {
            conditions.push('leaderboard_id = ?');
            params.push(leaderboard_id);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LeaderboardChallengeTime Endpoints
app.get('/api/leaderboardchallengetime', async (req, res) => {
    try {
        const { name, folder_date, data_date, leaderboard_id } = req.query;
        let query = 'SELECT * FROM LeaderboardChallengeTime';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (leaderboard_id) {
            conditions.push('leaderboard_id = ?');
            params.push(leaderboard_id);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Matches Endpoints
app.get('/api/matches', async (req, res) => {
    try {
        const { host, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM Matches';
        let conditions = [];
        let params = [];

        if (host) {
            conditions.push('host LIKE ?');
            params.push(`%${host}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// OG Endpoints
app.get('/api/og', async (req, res) => {
    try {
        const { name, folder_date, data_date, leaderboard_id } = req.query;
        let query = 'SELECT * FROM OG';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (leaderboard_id) {
            conditions.push('leaderboard_id = ?');
            params.push(leaderboard_id);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// OfflineTop10 Endpoints
app.get('/api/offlinetop10', async (req, res) => {
    try {
        const { name, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM OfflineTop10';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// OnlineUsers Endpoints
app.get('/api/onlineusers', async (req, res) => {
    try {
        const { folder_date, data_date } = req.query;
        let query = 'SELECT * FROM OnlineUsers';
        let conditions = [];
        let params = [];

        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TimeAttack Endpoints
app.get('/api/timeattack', async (req, res) => {
    try {
        const { name, folder_date, data_date, leaderboard_id } = req.query;
        let query = 'SELECT * FROM TimeAttack';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (leaderboard_id) {
            conditions.push('leaderboard_id = ?');
            params.push(leaderboard_id);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TimeAttackTop10 Endpoints
app.get('/api/timeattacktop10', async (req, res) => {
    try {
        const { name, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM TimeAttackTop10';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TimeAttackTop3 Endpoints
app.get('/api/timeattacktop3', async (req, res) => {
    try {
        const { name, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM TimeAttackTop3';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Top10 Endpoints
app.get('/api/top10', async (req, res) => {
    try {
        const { name, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM Top10';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Top3 Endpoints
app.get('/api/top3', async (req, res) => {
    try {
        const { name, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM Top3';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params

.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// XBLCity Endpoints
app.get('/api/xblcity', async (req, res) => {
    try {
        const { name, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM XBLCity';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// XBLCityRaces Endpoints
app.get('/api/xblcityraces', async (req, res) => {
    try {
        const { name, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM XBLCityRaces';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// XBLTotal Endpoints
app.get('/api/xbltotal', async (req, res) => {
    try {
        const { name, folder_date, data_date } = req.query;
        let query = 'SELECT * FROM XBLTotal';
        let conditions = [];
        let params = [];

        if (name) {
            conditions.push('name LIKE ?');
            params.push(`%${name}%`);
        }
        if (folder_date) {
            conditions.push('folder_date = ?');
            params.push(folder_date);
        }
        if (data_date) {
            conditions.push('data_date = ?');
            params.push(data_date);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await runQuery(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});