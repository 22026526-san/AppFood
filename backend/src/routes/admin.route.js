import express from 'express';
import { DeleteReview, getFoodList, InsertCategory, InsertVouchers } from '../controllers/admin.controller.js';

const router = express.Router();
router.get('/admin/get_food_list', getFoodList);
router.post('/admin/insert_category', InsertCategory);
router.post('/admin/insert_voucher', InsertVouchers);
router.post('/admin/delete_review', DeleteReview);
export default router;