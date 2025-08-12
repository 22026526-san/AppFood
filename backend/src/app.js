import express from 'express';
import './configs/database.js'; 
import cors from 'cors';
const app = express();
import signupRoutes from './routes/signup.route.js';
import userRoutes from './routes/user.route.js'
import foodRoutes from './routes/food.route.js'
import adminRoutes from './routes/admin.route.js'

app.use(cors());
app.use(express.json());
app.use('/api', signupRoutes);
app.use('/api', userRoutes);
app.use('/api', foodRoutes);
app.use('/api', adminRoutes);

app.get("/api/appfood", (req, res) => {
  res.status(200).json({
    success: true,
    });
});

const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
  console.log('Server is running on', PORT);
});