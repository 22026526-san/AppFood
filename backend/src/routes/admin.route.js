import express from 'express';
import { getFoodList, InsertCategory } from '../controllers/admin.controller.js';

const router = express.Router();
router.get('/admin/get_food_list', getFoodList);
router.post('/admin/insert_category', InsertCategory);
export default router;