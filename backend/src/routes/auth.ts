import { Router } from 'express';
import { pool } from '../database/connection';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const authRoutes = Router();

// Telegram Web App authentication
authRoutes.post('/telegram', async (req, res) => {
  try {
    const { initData } = req.body;

    if (!initData) {
      return res.status(400).json({ success: false, error: 'No initData provided' });
    }

    // In production, verify Telegram initData signature
    // For now, we'll parse it directly
    const params = new URLSearchParams(initData);
    const userData = JSON.parse(params.get('user') || '{}');

    if (!userData.id) {
      return res.status(400).json({ success: false, error: 'Invalid user data' });
    }

    // Find or create user
    let result = await pool.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [userData.id]
    );

    let user;
    if (result.rows.length === 0) {
      // Create new user
      const insertResult = await pool.query(
        `INSERT INTO users (telegram_id, username, first_name, last_name)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userData.id, userData.username, userData.first_name, userData.last_name]
      );
      user = insertResult.rows[0];
    } else {
      // Update existing user
      const updateResult = await pool.query(
        `UPDATE users 
         SET username = $1, first_name = $2, last_name = $3, updated_at = CURRENT_TIMESTAMP
         WHERE telegram_id = $4
         RETURNING *`,
        [userData.username, userData.first_name, userData.last_name, userData.id]
      );
      user = updateResult.rows[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        telegramId: user.telegram_id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          telegram_id: user.telegram_id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
});

// Get current user
authRoutes.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [
      decoded.userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      data: {
        id: user.id,
        telegram_id: user.telegram_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

