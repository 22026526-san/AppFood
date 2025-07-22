import pool from '../configs/database.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [existingUser] = await pool
      .promise()
      .query('SELECT * FROM users WHERE phone = ?', [phone]);

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Số điện thoại đã được sử dụng',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.promise().query(
      'INSERT INTO users (user_name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name, email, phone, hashedPassword]
    );

    res.status(201).json({
      success: true,
      user_id: result.insertId,
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

