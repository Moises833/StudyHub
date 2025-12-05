const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

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

// Validation schema
const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { name, email, password } = req.body;
    try {
        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM usuarios WHERE "Email" = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const newUser = await pool.query(
            'INSERT INTO usuarios ("NickName", "Email", "Password") VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
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
        const result = await pool.query('SELECT * FROM usuarios WHERE "Email" = $1', [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            
            // Verify password
            const validPassword = await bcrypt.compare(password, user.Password);
            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

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
