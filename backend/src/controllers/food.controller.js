import pool from '../configs/database.js';

export const getFoodInfo = async (req, res) => {
  try {
    const { foodId } = req.body;

    if (!foodId) {
      return res.status(400).json({ error: 'Missing required field' });
    }

    const query = 
    `SELECT 
    f.food_id,
    f.food_name,
    f.description,
    f.price,
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

    res.status(201).json({
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
            pool.query(query,(err, results) => {
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
            pool.query(queryy,[categoryId], (err, results) => {
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
