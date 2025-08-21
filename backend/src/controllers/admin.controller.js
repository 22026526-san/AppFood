import pool from '../configs/database.js';
import { handleUpload } from '../middlewares/upload.js';

export const getFoodList = async (req, res) => {
    try {
        const query = 
        `select 
            f.food_id,
            f.food_name,
            f.price,
            f.image_url,
            f.created_at,
            r.food_rate,
            r.sum_rate,
            c.category_id,
            c.category_name
            from food f
            inner join rate r on r.food_id = f.food_id
            inner join category_food c on c.category_id = f.category_id
            order by r.sum_rate desc; `
        const food = await new Promise((resolve, reject) => {
            pool.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        res.status(201).json({
            success: true,
            message: food
        });
    } catch (error) {
        console.error('Error inserting foodList:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const InsertCategory = async (req, res) => {
  const  category  = req.body.categoryName;

  if (!req.file || !category) {
    return res.status(400).json({ error: "Invalid file data" });
  }

  const base64 = Buffer.from(req.file.buffer).toString("base64");
  const dataURI = `data:${req.file.mimetype};base64,${base64}`;
  const cldRes = await handleUpload(dataURI,'category');

  try {

    const cart = await pool
      .promise()
      .query('insert into category_food(category_name,category_img) values (?,?)', [category,cldRes.url]);

    res.json({ success: true, message: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const InsertVouchers = async (req, res) => {
  const { code,description,maxDiscount,discountPercent,startDate,endDate } = req.body;

  if (!code || !description || !maxDiscount|| !discountPercent || !startDate || !endDate) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const start_Date = startDate.split("T")[0];
    const end_Date = endDate.split("T")[0];

    const cart = await pool
      .promise()
      .query('INSERT INTO vouchers (code, description, discount_percent, max_discount, start_date, end_date) values (?,?,?,?,?,?)', [code,description,discountPercent,maxDiscount,start_Date,end_Date]);

    res.json({ success: true, message: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const DeleteReview = async (req, res) => {
  const { reviewId } = req.body;

  if (!reviewId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const cart = await pool
      .promise()
      .query('delete from reviews where review_id = ?', [reviewId]);

    res.json({ success: true, message: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const DeleteCategory = async (req, res) => {
  const { cateId } = req.body;

  if (!cateId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const cart = await pool
      .promise()
      .query('delete from category_food where category_id = ?',[cateId]);

    res.json({ success: true, message: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const DeleteVoucher = async (req, res) => {
  const { voucherId } = req.body;

  if (!voucherId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const cart = await pool
      .promise()
      .query('delete from vouchers where id = ?',[voucherId]);

    res.json({ success: true, message: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const ImgFoodUpload = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const base64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${base64}`;
    const cldRes = await handleUpload(dataURI,'food');

    if (cldRes) {
      return res.status(200).json({
        message: 'Ảnh đã được cập nhật.',
        success: true,
        img: cldRes.url
      });
    }
    res.json({
      message: 'Đã có lỗi xảy ra',
      success: false
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false
    });
  }
};

export const UpdateFoods = async (req, res) => {
  const { name,description,categoryId,price,img,foodId } = req.body;

  if (!name || !description || !categoryId|| !price || !img||!foodId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const cart = await pool
      .promise()
      .query('UPDATE food SET food_name = ?, description = ? , price = ?, image_url = ?, category_id = ? WHERE food_id = ?', [name, description, price, img,categoryId,foodId])

    res.json({ success: true, message: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const DeleteFood = async (req, res) => {
  const { foodId } = req.body;

  if (!foodId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const step1 = await pool
      .promise()
      .query('DELETE FROM rate WHERE food_id = ?', [foodId]);

    const step2 = await pool
      .promise()
      .query('delete from food where food_id = ?', [foodId]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const InsertFoods = async (req, res) => {
  const { name,description,categoryId,price,img } = req.body;

  if (!name || !description || !categoryId|| !price || !img) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const cart = await pool
      .promise()
      .query('INSERT INTO food (food_name, description, image_url, price, category_id) VALUES (?,?,?,?,?)', [name, description,img, price,categoryId])

    res.json({ success: true, message: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {

    const [rows] = await pool
      .promise()
      .query('SELECT * FROM users');

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: rows
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const setUserActive = async (req, res) => {
  const { active,id } = req.body;

  if (!id || active === undefined) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const step1 = await pool
      .promise()
      .query('Update users set user_active = ? WHERE user_id = ?', [active,id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};