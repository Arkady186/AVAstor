import { Router } from 'express';
import { pool } from '../database/connection';

export const categoryRoutes = Router();

// Get all categories
categoryRoutes.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = true) as products_count
       FROM categories c
       WHERE c.parent_id IS NULL
       ORDER BY c.name`
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// Get single category with subcategories
categoryRoutes.get('/:id', async (req, res) => {
  try {
    const categoryResult = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [req.params.id]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const subcategoriesResult = await pool.query(
      'SELECT * FROM categories WHERE parent_id = $1 ORDER BY name',
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...categoryResult.rows[0],
        subcategories: subcategoriesResult.rows,
      },
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch category' });
  }
});

