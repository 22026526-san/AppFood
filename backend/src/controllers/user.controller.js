import pool from '../configs/database.js';
import { handleUpload } from '../middlewares/upload.js';

export const updateUser = async (req, res) => {

  try {
    const { name, phone, email, clerk_id } = req.body;

    if (!clerk_id || !name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required field' });
    }

    const [updateUser] = await pool
      .promise()
      .query('UPDATE users SET user_name = ?, email = ? , phone = ? WHERE clerk_id = ?', [name, email, phone, clerk_id]);

    res.status(201).json({
      success: true,
      message: "Cập nhật thành công"
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export const getUserInfo = async (req, res) => {
  try {
    const { clerkId } = req.body;

    if (!clerkId) {
      return res.status(400).json({ error: 'Missing clerk_id' });
    }

    const [rows] = await pool
      .promise()
      .query('SELECT * FROM users WHERE clerk_id = ?', [clerkId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const updateImgUser = async (req, res) => {
  try {
    const userId = req.body.Id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const base64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64}`;
    const cldRes = await handleUpload(dataURI);

    const [updateUser] = await pool
      .promise()
      .query('UPDATE users SET img = ? WHERE clerk_id = ?', [cldRes.url, userId]);

    res.status(200).json({
      message: 'Ảnh đại diện đã cập nhật.',
      success: true,
      img : cldRes.url
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false
    });
  }

};