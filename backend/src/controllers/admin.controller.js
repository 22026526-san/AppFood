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

export const getDashBoard = async (req, res) => {
  try {
    const { start, end } = req.body;

    if (!start || !end) {
      return res.status(400).json({ error: 'Missing required field' });
    }

    const start_Date = start.split("T")[0];
    const end_Date = end.split("T")[0];

    var data = {
        stats: {
          activeUsers: '',
          totalOrders: '',
          revenue: '',
          avgOrder: '',
          order: [],
        },
        bestFoods: [],
        recentOrders: [],
    }
    const query =
      `SELECT IFNULL(COUNT(*), 0) AS totalOrders
        FROM orders
        WHERE
        DATE(created_at) BETWEEN ? AND ?;`
    const sum_order = await new Promise((resolve, reject) => {
      pool.query(query, [start_Date ,end_Date], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    data.stats.totalOrders = sum_order[0].totalOrders;

    const query_user =
      `SELECT IFNULL(COUNT(DISTINCT clerk_id), 0) AS activeUsers
        FROM users
        where user_active = 1;`
    const user = await new Promise((resolve, reject) => {
      pool.query(query_user, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    data.stats.activeUsers = user[0].activeUsers;

    const queryy =
      `SELECT IFNULL(SUM(total_price), 0) AS revenue
        FROM orders
        WHERE status = 'completed'
        AND DATE(created_at) BETWEEN ? AND ? ;`
    const price = await new Promise((resolve, reject) => {
      pool.query(queryy, [start_Date, end_Date], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    data.stats.revenue = price[0].revenue;

    const query2 =
      `SELECT IFNULL(AVG(total_price), 0) AS avgOrder
        FROM orders
        WHERE status = 'completed'
        AND DATE(created_at) BETWEEN ? AND ?;`
    const avg_order = await new Promise((resolve, reject) => {
      pool.query(query2, [start_Date, end_Date], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    data.stats.avgOrder = avg_order[0].avgOrder; 

    const [orderDataa] = await pool.promise().query(
      `SELECT 
        o.order_id,
        o.clerk_id,
        o.order_type,
        o.address,
        o.table_number,
        o.status,
        o.total_price,
        o.voucher_code,
        o.payment_method,
        o.status_payment,
        o.created_at,
        u.user_name,
        u.phone
        FROM orders o inner join users u on o.clerk_id = u.clerk_id
         WHERE DATE(o.created_at) BETWEEN ? AND ?
      ORDER BY o.created_at desc; `,[start_Date, end_Date]
    );

    if (orderDataa.length === 0) {
      data.stats.order = [];
    }

    const orders = await Promise.all(
      orderDataa.map(async (order) => {
    
        const [order_detail] = await pool.promise().query(
          `SELECT
            f.food_id,
            f.food_name,
            f.image_url,
            od.quantity,
            od.unit_price
            from order_detail od 
            inner join food f 
            on f.food_id = od.food_id 
            where od.order_id = ?;`,
          [order.order_id]
        );

        return {
          user_name: order.user_name,
          phone: order.phone,
          order_id: order.order_id,
          clerk_id: order.clerk_id,
          order_type: order.order_type,
          address: order.address,
          table_number: order.table_number,
          status: order.status,
          total_price: order.total_price,
          voucher_code: order.voucher_code,
          payment_method: order.payment_method,
          status_payment: order.status_payment,
          created_at: order.created_at,
          order_detail : order_detail
        };
      })
    );

    data.stats.order = orders;

    const query4 =
      `select f.food_name , f.sold,f.food_id from food f
        order by f.sold desc
        limit 6 `
    const bestfood = await new Promise((resolve, reject) => {
      pool.query(query4, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    data.bestFoods = bestfood;

    const [orderData] = await pool.promise().query(
      `SELECT 
        o.order_id,
        o.clerk_id,
        o.order_type,
        o.address,
        o.table_number,
        o.status,
        o.total_price,
        o.voucher_code,
        o.payment_method,
        o.status_payment,
        o.created_at,
        u.user_name,
        u.phone
        FROM orders o inner join users u on o.clerk_id = u.clerk_id
        order by o.created_at desc
        limit 6 `
    );

    if (orderData.length === 0) {
      data.recentOrders = [];
    }

    const nearorder = await Promise.all(
      orderData.map(async (order) => {
    
        const [order_detail] = await pool.promise().query(
          `SELECT
            f.food_id,
            f.food_name,
            f.image_url,
            od.quantity,
            od.unit_price
            from order_detail od 
            inner join food f 
            on f.food_id = od.food_id 
            where od.order_id = ?;`,
          [order.order_id]
        );

        return {
          user_name: order.user_name,
          phone: order.phone,
          order_id: order.order_id,
          clerk_id: order.clerk_id,
          order_type: order.order_type,
          address: order.address,
          table_number: order.table_number,
          status: order.status,
          total_price: order.total_price,
          voucher_code: order.voucher_code,
          payment_method: order.payment_method,
          status_payment: order.status_payment,
          created_at: order.created_at,
          order_detail : order_detail
        };
      })
    );

    data.recentOrders = nearorder;

    return res.status(201).json({
      success: true,
      message: data
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const getOrders = async (req, res) => {

  try {
   
    const [orderData] = await pool.promise().query(
      `SELECT 
        o.order_id,
        o.clerk_id,
        o.order_type,
        o.address,
        o.table_number,
        o.status,
        o.total_price,
        o.voucher_code,
        o.payment_method,
        o.status_payment,
        o.created_at,
        u.user_name,
        u.phone
        FROM orders o inner join users u on o.clerk_id = u.clerk_id`
    );

    if (orderData.length === 0) {
      return res.json(orderData);
    }

    const ordersInfo = await Promise.all(
      orderData.map(async (order) => {
    
        const [order_detail] = await pool.promise().query(
          `SELECT
            f.food_id,
            f.food_name,
            f.image_url,
            od.quantity,
            od.unit_price
            from order_detail od 
            inner join food f 
            on f.food_id = od.food_id 
            where od.order_id = ?;`,
          [order.order_id]
        );

        return {
          user_name: order.user_name,
          phone: order.phone,
          order_id: order.order_id,
          clerk_id: order.clerk_id,
          order_type: order.order_type,
          address: order.address,
          table_number: order.table_number,
          status: order.status,
          total_price: order.total_price,
          voucher_code: order.voucher_code,
          payment_method: order.payment_method,
          status_payment: order.status_payment,
          created_at: order.created_at,
          order_detail : order_detail
        };
      })
    );

    return res.json({success :true,message:ordersInfo});
  } catch (error) {
    console.error('Error fetching order data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const updateStatus = async (req, res) => {
  const { orderId,status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const step1 = await pool
      .promise()
      .query(`Update orders set status = ?, status_payment = 'yes' WHERE order_id = ?`, [status,orderId]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};