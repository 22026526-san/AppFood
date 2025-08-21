import e from 'express';
import pool from '../configs/database.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Missing required fiel' });
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

export const signUpGG_FB = async (req, res) => {

  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Missing required field' });
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

    const [result] = await pool.promise().query(
      'INSERT INTO users (user_name, phone ) VALUES (?, ?)',
      [name, phone]
    );

    res.status(201).json({
      success: true,
      user_id: result.insertId,
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const sign_check_user = async (req, res) => {

  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Missing required field' });
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

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const signup_update = async (req, res) => {

  try {
    const { flerkId, id, email } = req.body;

    if (!flerkId || !email) {
      return res.status(400).json({ error: 'Missing required field' });
    }

    const [update] = await pool
      .promise()
      .query('UPDATE users SET clerk_id = ?, email = ? WHERE user_id = ?', [flerkId,email, id]);

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const UpdatePass = async (req, res) => {

  try {
    const { email, pass } = req.body;

    if (!email || !pass) {
      return res.status(400).json({ error: 'Missing required field' });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    await pool
      .promise()
      .query(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, email]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
