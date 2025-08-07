import pool from '../configs/database.js';

export const getFoodInfo = async (req, res) => {
  try {
    const { foodId, clerkId } = req.body;

    if (!foodId || !clerkId) {
      return res.status(400).json({ error: 'Missing required field' });
    }

    const query =
      `SELECT 
    f.food_id,
    f.food_name,
    f.price,
    f.image_url,
    f.description,
    f.category_id,
    r.food_rate,
    r.sum_rate
    FROM food f
    INNER JOIN rate r 
    ON f.food_id = r.food_id
    WHERE f.food_id = ? `
    const foodInfo = await new Promise((resolve, reject) => {
      pool.query(query, [foodId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    const queryy =
      `SELECT *
    from favorites f
    WHERE f.food_id = ? and f.cleck_id = ?`
    const like = await new Promise((resolve, reject) => {
      pool.query(queryy, [foodId, clerkId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (like.length === 0) {
      return res.status(201).json({
        like: false,
        success: true,
        message: foodInfo
      });
    }

    return res.status(201).json({
      like: true,
      success: true,
      message: foodInfo
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const getFoodCard = async (req, res) => {
  try {

    var postFood = {
      topRate: [],
      allDishes: []
    };

    const query =
      `SELECT 
    f.food_id,
    f.food_name,
    f.price,
    f.image_url
    FROM food f `
    const card = await new Promise((resolve, reject) => {
      pool.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    postFood.allDishes = card;

    const queryy =
      `SELECT 
    f.food_id,
    f.food_name,
    f.price,
    f.image_url,
    r.food_rate
    FROM food f
    INNER JOIN rate r 
    ON f.food_id = r.food_id
    ORDER BY r.food_rate DESC
    limit 6;`
    const rate = await new Promise((resolve, reject) => {
      pool.query(queryy, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    postFood.topRate = rate;

    res.status(201).json({
      success: true,
      message: postFood
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const getFoodwithCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({ error: 'Missing required field' });
    }

    var postFood = {
      cateRate: [],
      cateAll: []
    };

    const query =
      `SELECT 
    f.food_id,
    f.food_name,
    f.price,
    f.image_url
    FROM food f 
    WHERE f.category_id = ? `
    const all = await new Promise((resolve, reject) => {
      pool.query(query, [categoryId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
    postFood.cateAll = all;

    const queryy =
      `SELECT 
    f.food_id,
    f.food_name,
    f.price,
    f.image_url,
    r.food_rate
    FROM food f
    INNER JOIN rate r 
    ON f.food_id = r.food_id
    WHERE f.category_id = ?
    ORDER BY r.food_rate DESC
    limit 6;`
    const rate = await new Promise((resolve, reject) => {
      pool.query(queryy, [categoryId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    postFood.cateRate = rate;

    res.status(201).json({
      success: true,
      message: postFood
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const getAllTopRate = async (req, res) => {
  try {

    const query =
      `SELECT 
    f.food_id,
    f.food_name,
    f.price,
    f.image_url,
    r.food_rate
    FROM food f
    INNER JOIN rate r 
    ON f.food_id = r.food_id
    ORDER BY r.food_rate DESC;`
    const foodInfo = await new Promise((resolve, reject) => {
      pool.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.status(201).json({
      success: true,
      message: foodInfo
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export const getFoodPopular = async (req, res) => {
  try {

    const query =
      `SELECT 
    f.food_id,
    f.food_name,
    f.price,
    f.image_url,
    r.sum_rate
    FROM food f
    INNER JOIN rate r 
    ON f.food_id = r.food_id
    ORDER BY r.sum_rate DESC
    LIMIT 6;`
    const foodInfo = await new Promise((resolve, reject) => {
      pool.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.status(201).json({
      success: true,
      message: foodInfo
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const getVouchers = async (req, res) => {
  try {

    const { voucher_code, clerkId } = req.body

    if (!voucher_code || !clerkId) {
      return res.status(400).json({ error: 'Missing required fiel' });
    }

    const [vouchers] = await pool
      .promise()
      .query('SELECT v.discount_percent, max_discount FROM  vouchers v WHERE v.code NOT IN (SELECT o.voucher_code FROM orders o WHERE o.clerk_id = ? ) and v.code = ?', [clerkId, voucher_code]);

    if (vouchers.length === 0) {
      return res.status(201).json({
        success: false,
        message: vouchers
      });
    }
    res.status(201).json({
      success: true,
      message: vouchers
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ success: false, message: error });
  }
}

export const SearchFood = async (req, res) => {
  const { search } = req.body;

  if (!search) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const query =
      `SELECT 
    f.food_id,
    f.food_name,
    f.price,
    f.image_url
    FROM food f 
    where f.food_name like ? `
    const card = await new Promise((resolve, reject) => {
      pool.query(query, [`%${search}%`], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.json({ success: true, message: card });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};