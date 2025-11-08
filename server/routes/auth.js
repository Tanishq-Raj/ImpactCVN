import express from 'express';
import db from '../db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

/**
 * POST /api/users/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name, email, and password are required'
      });
    }

    // Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name must be at least 2 characters'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Please enter a valid email address'
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if email already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'Registration error',
        message: 'Email already registered'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert new user
    const result = await db.query(
      'INSERT INTO users (name, email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, name, email, created_at',
      [name.trim(), email.toLowerCase().trim(), passwordHash]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      message: 'Account created successfully',
      userId: newUser.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred during registration'
    });
  }
});

/**
 * POST /api/users/login
 * Authenticate a user and return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const result = await db.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Authentication error',
        message: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication error',
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // Return token and user info (excluding password)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred during login'
    });
  }
});

export default router;
