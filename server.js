require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Define route to create database host
app.post('/create-host', (req, res) => {
  const { name, host, port, username, password, linkedNode } = req.body;

  if (!name || !host || !username || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  db.query(
    'INSERT INTO hosts (name, host, port, username, password, linked_node) VALUES (?, ?, ?, ?, ?, ?)',
    [name, host, port || 3306, username, password, linkedNode || null],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error adding host' });
      }
      return res.status(201).json({ message: 'Database host created successfully' });
    }
  );
});

// Server listening
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
// Define route to get all database hosts
app.get('/hosts', (req, res) => {
    db.query('SELECT * FROM hosts', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving hosts' });
        }
        return res.status(200).json(results);
    });
});

// Define route to delete a database host by ID
app.delete('/hosts/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM hosts WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting host' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Host not found' });
        }
        return res.status(200).json({ message: 'Host deleted successfully' });
    });
});