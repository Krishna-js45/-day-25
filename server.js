const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Connect to SQLite
const db = new sqlite3.Database('mydata.db', (err) => {
    if (err) return console.error('❌ DB Error:', err.message);
    console.log('🗄️ Connected to SQLite DB');

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        name TEXT,
        email TEXT,
        roll_number TEXT,
        semester TEXT
    )`);

    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
        if (row && row.count === 0) {
            db.run(`INSERT INTO users 
                (username, password, name, email, roll_number, semester) VALUES 
                ('raj', 'pass123', 'Rajkrishna', 'raj@example.com', 'CS101', '6'),
                ('alice', 'pass456', 'Alice', 'alice@example.com', 'CS102', '5')
            `);
            console.log("✅ Sample users added");
        }
    });
});

// Login API
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(
        `SELECT name, email, roll_number, semester FROM users WHERE username = ? AND password = ?`,
        [username, password],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: "Internal DB error" });
            } else if (row) {
                res.json({ success: true, user: row });
            } else {
                res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        }
    );
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

