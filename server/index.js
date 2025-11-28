const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Connected to Database successfully:', result.rows[0]);
    });
});

// Routes
app.get('/', (req, res) => {
    res.send('StudyHub API is running');
});

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as time');
        res.json({
            success: true,
            message: 'Database connection successful',
            time: result.rows[0].time
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: err.message
        });
    }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM usuarios WHERE "Email" = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        // Insert new user
        // Note: In production, password should be hashed!
        const newUser = await pool.query(
            'INSERT INTO usuarios ("NickName", "Email", "Password") VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );

        res.json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: err.message
        });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE "Email" = $1 AND "Password" = $2', [email, password]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            // Don't send password back
            delete user.Password;
            res.json({
                success: true,
                message: 'Login exitoso',
                user: user
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: err.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
