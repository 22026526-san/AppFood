require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

connection.connect((err) => {
  if (err) {
    console.log('Lỗi kết nối MySQL:', err.message);
  } else {
    console.log('Kết nối MySQL thành công!');
  }
});

module.exports = connection;
