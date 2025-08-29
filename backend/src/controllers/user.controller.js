import pool from '../configs/database.js';
import { handleUpload } from '../middlewares/upload.js';
import {Expo} from 'expo-server-sdk';

const expo = new Expo();

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
    const cldRes = await handleUpload(dataURI,'avatar');

    const [updateUser] = await pool
      .promise()
      .query('UPDATE users SET img = ? WHERE clerk_id = ?', [cldRes.url, userId]);

    res.status(200).json({
      message: 'Ảnh đại diện đã cập nhật.',
      success: true,
      img: cldRes.url
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false
    });
  }

};

export const updateFavourite = async (req, res) => {
  try {
    const { clerkId, foodId, userLike } = req.body;

    if (!clerkId || !foodId) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (userLike === false) {
      const [updateUser_1] = await pool
        .promise()
        .query('DELETE FROM favorites WHERE cleck_id = ? AND food_id = ?', [clerkId, foodId]);

      res.status(200).json({
        success: true,
        message: "Removed from favorites"
      })

    } else {
      const [updateUser] = await pool
        .promise()
        .query('insert into favorites (cleck_id , food_id) values (?,?)', [clerkId, foodId]);

      res.status(200).json({
        success: true,
        message: "Added to favorites"
      });
    }

  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false
    });
  }

};

export const saveCart = async (req, res) => {
  const { clerkId, cart } = req.body;

  if (!clerkId || !Array.isArray(cart)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    await pool.promise().query("DELETE FROM cart WHERE clerk_id = ?", [clerkId]);


    const values = cart.map(item => [clerkId, item.food_id, item.quantity, item.price]);
    if (values.length > 0) {
      await pool.promise().query(
        "INSERT INTO cart (clerk_id, food_id, quantity,price) VALUES ?",
        [values]
      );
    }

    res.json({ success: true, message: "Cart saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const setUserCart = async (req, res) => {
  const { clerkId } = req.body;

  if (!clerkId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const cart = await pool
      .promise()
      .query('select f.food_id,f.food_name,f.price,f.image_url,c.quantity from food f inner join cart c  on c.food_id = f.food_id  where c.clerk_id = ? ', [clerkId]);

    res.json({ success: true, message: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFavourites = async (req, res) => {
  const { clerkId } = req.body;

  if (!clerkId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const favourite = await pool
      .promise()
      .query('select f.food_id,f.food_name,f.price,f.image_url from food f inner join favorites fa  on f.food_id = fa.food_id  where fa.cleck_id = ? ', [clerkId]);

    res.json({ success: true, message: favourite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVouchers = async (req, res) => {
  const { clerkId } = req.body;

  if (!clerkId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const vouchers = await pool
      .promise()
      .query(`SELECT *
              FROM vouchers v
              WHERE v.code NOT IN (
              SELECT o.voucher_code
              FROM orders o
              WHERE o.clerk_id = ?
              AND o.voucher_code IS NOT NULL )
              AND CURDATE() BETWEEN v.start_date AND v.end_date
              order by v.id desc;`, [clerkId]);

    res.json({ success: true, message: vouchers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const OrderFood = async (req, res) => {
  const { clerkId, order_type, text, discount, payment,name } = req.body;
  const voucher = req.body.voucher || null;

  if (!clerkId || !order_type || !text || !discount || !payment || !name) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const orders = await pool
      .promise()
      .query(`CALL process_order_food(?,?,?,?,?,?);`, [clerkId, order_type, text, discount, payment, voucher]);

    const [users] = await pool
      .promise()
      .query(
        `SELECT expo_token,clerK_id FROM users 
         WHERE role = 'manager' AND expo_token IS NOT NULL`
      );

    const title = "🛒 Có đơn hàng mới!";
    const message = `Khách hàng ${name} vừa đặt đơn hàng mới.`;  

    // 3. Insert notifications vào DB (bulk insert)
    if (users.length > 0) {
      const values = users.map((u) => [u.clerk_id, title, message,'Order']);
      await pool
        .promise()
        .query(
          `INSERT INTO notifications (clerk_id, title, message,router) VALUES ?`,
          [values]
        );
    }

    // 4. Tạo danh sách message gửi qua Expo
    let messages = [];
    for (const user of users) {
      if (!Expo.isExpoPushToken(user.expo_token)) continue; // check token hợp lệ

      messages.push({
        to: user.expo_token,
        sound: "default",
        title,
        body: message,
      });
    }

    // 5. Chunk & send
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error("Expo push error:", error);
      }
    }

    res.json({
      success: true,
      tickets,
      message: 'Đặt hàng thành công',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  const { clerkId} = req.body;

  if (!clerkId ) {
    return res.status(400).json({ error: "Invalid data" });
  }

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
        o.created_at
        FROM orders o   
        WHERE o.clerk_id = ?
        order by o.created_at desc;`,
      [clerkId]
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

export const cancelOrders = async (req, res) => {
  try {
    const {orderId,name} = req.body;

    if (!orderId || !name) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const [orders] = await pool
      .promise()
      .query("UPDATE orders SET status = 'canceled' WHERE order_id = ? ", [orderId]);
    
    const [users] = await pool
      .promise()
      .query(
        `SELECT expo_token,clerK_id FROM users 
         WHERE role = 'manager' AND expo_token IS NOT NULL`
      );

    const title = "⚠️ Đơn hàng bị hủy";
    const message = `Đơn hàng của khách hàng ${name} đã bị hủy.`;  

    // 3. Insert notifications vào DB (bulk insert)
    if (users.length > 0) {
      const values = users.map((u) => [u.clerk_id, title, message,'Order']);
      await pool
        .promise()
        .query(
          `INSERT INTO notifications (clerk_id, title, message,router) VALUES ?`,
          [values]
        );
    }

    // 4. Tạo danh sách message gửi qua Expo
    let messages = [];
    for (const user of users) {
      if (!Expo.isExpoPushToken(user.expo_token)) continue; // check token hợp lệ

      messages.push({
        to: user.expo_token,
        sound: "default",
        title,
        body: message,
      });
    }

    // 5. Chunk & send
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error("Expo push error:", error);
      }
    }

    res.json({
      success: true,
      tickets,
    });

  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      success: false
    });
  }

};

export const ReviewsFood = async (req, res) => {
  const { clerkId, comment,star, item,name } = req.body;

  if (!clerkId || !Array.isArray(item)||!star) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const values = item.map(i => [clerkId, i.food_id, comment, star]);
    if (values.length > 0) {
      await pool.promise().query(
        "INSERT INTO reviews (clerk_id, food_id, comment,star) VALUES ?",
        [values]
      );
    }
    
    const [users] = await pool
      .promise()
      .query(
        `SELECT expo_token,clerK_id FROM users 
         WHERE role = 'manager' AND expo_token IS NOT NULL`
      );

    const title = "📝 Đánh giá mới từ khách hàng";
    const message = `Khách hàng ${name} vừa gửi đánh giá ⭐. Hãy xem ngay để phản hồi kịp thời.`;  

    // 3. Insert notifications vào DB (bulk insert)
    if (users.length > 0) {
      const values = users.map((u) => [u.clerk_id, title, message,'Order']);
      await pool
        .promise()
        .query(
          `INSERT INTO notifications (clerk_id, title, message,router) VALUES ?`,
          [values]
        );
    }

    // 4. Tạo danh sách message gửi qua Expo
    let messages = [];
    for (const user of users) {
      if (!Expo.isExpoPushToken(user.expo_token)) continue; // check token hợp lệ

      messages.push({
        to: user.expo_token,
        sound: "default",
        title,
        body: message,
      });
    }

    // 5. Chunk & send
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error("Expo push error:", error);
      }
    }

    res.json({
      success: true,
      tickets,
      message: 'Danh gia thanh cong',
    });
    

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateExpoToken = async (req, res) => {
  const { id, token } = req.body;

  if (!id || !token) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const update = await pool
      .promise()
      .query(`update users set expo_token = ? where clerk_id = ?`, [token, id]);

    res.json({ success: true, message: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNotice = async (req, res) => {
  const { clerkId } = req.body;

  if (!clerkId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const notices = await pool
      .promise()
      .query(`SELECT *
              FROM notifications v
              WHERE v.clerk_id = ? 
              order by v.created_at desc;`, [clerkId]);

    res.json({ success: true, message: notices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNotice = async (req, res) => {
  const { noticeId } = req.body;

  if (!noticeId) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {

    const step1 = await pool
      .promise()
      .query(`Update notifications set is_read = 1 WHERE id = ?`, [noticeId]);

      res.json({
      success: true
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};