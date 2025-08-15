import express from 'express';
import { DeleteCategory, DeleteReview, DeleteVoucher, getFoodList, InsertCategory, InsertVouchers } from '../controllers/admin.controller.js';
import {upload} from '../middlewares/upload.js'

const router = express.Router();
router.get('/admin/get_food_list', getFoodList);
router.post('/admin/insert_category',upload.single('image'), InsertCategory);
router.post('/admin/insert_voucher', InsertVouchers);
router.post('/admin/delete_review', DeleteReview);
router.post('/admin/delete_category', DeleteCategory);
router.post('/admin/delete_voucher', DeleteVoucher);
export default router;