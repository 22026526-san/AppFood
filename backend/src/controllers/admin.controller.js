import pool from '../configs/database.js';

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
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const cart = await pool
      .promise()
      .query('insert into category_food(category_name) values (?)', [categoryName]);

    res.json({ success: true, message: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};