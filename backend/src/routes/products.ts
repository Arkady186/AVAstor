import { Router } from 'express';
import { pool } from '../database/connection';
import { authenticate, AuthRequest } from '../middleware/auth';

export const productRoutes = Router();

// Get all products with filters
productRoutes.get('/', async (req, res) => {
  try {
    const {
      category_id,
      search,
      min_price,
      max_price,
      sort = 'created_at',
      order = 'DESC',
      page = '1',
      limit = '20',
    } = req.query;

    let query = 'SELECT * FROM products WHERE is_active = true';
    const params: any[] = [];
    let paramCount = 1;

    if (category_id) {
      query += ` AND category_id = $${paramCount}`;
      params.push(category_id);
      paramCount++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (min_price) {
      query += ` AND price >= $${paramCount}`;
      params.push(min_price);
      paramCount++;
    }

    if (max_price) {
      query += ` AND price <= $${paramCount}`;
      params.push(max_price);
      paramCount++;
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    query += ` ORDER BY ${sort} ${order} LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM products WHERE is_active = true'
    );

    res.json({
      success: true,
      data: {
        products: result.rows,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: parseInt(countResult.rows[0].count),
          pages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit as string)),
        },
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// Get single product
productRoutes.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name, u.username as seller_username
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE p.id = $1 AND p.is_active = true`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// Create product (requires authentication)
productRoutes.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      description,
      price,
      old_price,
      stock,
      sku,
      category_id,
      images,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, error: 'Name and price are required' });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, old_price, stock, sku, category_id, seller_id, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        name,
        description,
        price,
        old_price || null,
        stock || 0,
        sku || null,
        category_id || null,
        req.user!.id,
        images || [],
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// Update product (requires authentication)
productRoutes.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists and user owns it
    const checkResult = await pool.query(
      'SELECT seller_id FROM products WHERE id = $1',
      [productId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (checkResult.rows[0].seller_id !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const {
      name,
      description,
      price,
      old_price,
      stock,
      sku,
      category_id,
      images,
      is_active,
    } = req.body;

    const result = await pool.query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           old_price = COALESCE($4, old_price),
           stock = COALESCE($5, stock),
           sku = COALESCE($6, sku),
           category_id = COALESCE($7, category_id),
           images = COALESCE($8, images),
           is_active = COALESCE($9, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        name,
        description,
        price,
        old_price,
        stock,
        sku,
        category_id,
        images,
        is_active,
        productId,
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

