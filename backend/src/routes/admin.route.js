import express from 'express';
import { getFoodList } from '../controllers/admin.controller.js';

const router = express.Router();
router.get('/admin/get_food_list', getFoodList);
export default router;