const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Placeholder database for simplicity
const usersDB = [
    {
        username: 'player1',
        hardware: 'hardware-info-placeholder',
        ip: '192.168.1.1'
    }
];

// API route to verify player data
app.get('/verify', (req, res) => {
    const { name, hardware } = req.query;
    
    const user = usersDB.find(u => u.username === name && u.hardware === hardware);

    if (user) {
        res.send({ success: true, message: "Player verified!" });
    } else {
        res.send({ success: false, message: "Player verification failed!" });
    }
});

// Register player data (for new users)
app.post('/register', express.json(), (req, res) => {
    const { username, hardware, ip } = req.body;

    // Save the user data
    usersDB.push({ username, hardware, ip });

    res.send({ success: true, message: "Player registered successfully!" });
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
