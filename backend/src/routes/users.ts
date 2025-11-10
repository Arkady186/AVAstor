import { Router } from 'express';
import { pool } from '../database/connection';
import { authenticate, AuthRequest } from '../middleware/auth';

export const userRoutes = Router();

// All user routes require authentication
userRoutes.use(authenticate);

// Get user profile
userRoutes.get('/me', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [
      req.user!.id,
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
        phone: user.phone,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// Update user profile
userRoutes.put('/me', async (req: AuthRequest, res) => {
  try {
    const { phone, email } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET phone = COALESCE($1, phone),
           email = COALESCE($2, email),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [phone, email, req.user!.id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

// Get user cart
userRoutes.get('/cart', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, p.name, p.price, p.images, p.stock, p.old_price
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [req.user!.id]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
});

// Add to cart
userRoutes.post('/cart', async (req: AuthRequest, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }

    // Check if product exists and is active
    const productResult = await pool.query(
      'SELECT id, stock FROM products WHERE id = $1 AND is_active = true',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (productResult.rows[0].stock < quantity) {
      return res.status(400).json({ success: false, error: 'Insufficient stock' });
    }

    // Check if item already in cart
    const existingResult = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [req.user!.id, product_id]
    );

    if (existingResult.rows.length > 0) {
      // Update quantity
      const result = await pool.query(
        `UPDATE cart 
         SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND product_id = $3
         RETURNING *`,
        [quantity, req.user!.id, product_id]
      );
      res.json({ success: true, data: result.rows[0] });
    } else {
      // Add new item
      const result = await pool.query(
        `INSERT INTO cart (user_id, product_id, quantity)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [req.user!.id, product_id, quantity]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to add to cart' });
  }
});

// Update cart item
userRoutes.put('/cart/:id', async (req: AuthRequest, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, error: 'Invalid quantity' });
    }

    const result = await pool.query(
      `UPDATE cart 
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [quantity, req.params.id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Cart item not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to update cart' });
  }
});

// Remove from cart
userRoutes.delete('/cart/:id', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Cart item not found' });
    }

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: 'Failed to remove from cart' });
  }
});

