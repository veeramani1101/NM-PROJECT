//server.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Configure PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'se',
    password: 'Joker123#',
    port: 5432,
});

// Middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to add student to database
app.post('/enroll', upload.single('imageFile'), async (req, res) => {
    const { name, email, website, gender, skills } = req.body;
    const image = req.file ? req.file.buffer : null; // Use buffer to store image binary data

    try {
        const query = `
            INSERT INTO students (name, email, website, image, gender, skills)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [name, email, website, image, gender, skills];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error saving student:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Endpoint to retrieve enrolled students
app.get('/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
