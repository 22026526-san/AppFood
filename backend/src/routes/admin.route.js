import express from 'express';
import { DeleteCategory, DeleteFood, DeleteReview, DeleteVoucher, getFoodList, ImgFoodUpload, InsertCategory, UpdateFoods, InsertVouchers, InsertFoods, getUsers, setUserActive } from '../controllers/admin.controller.js';
import {upload} from '../middlewares/upload.js'

const router = express.Router();
router.get('/admin/get_food_list', getFoodList);
router.post('/admin/insert_category',upload.single('image'), InsertCategory);
router.post('/admin/insert_voucher', InsertVouchers);
router.post('/admin/delete_review', DeleteReview);
router.post('/admin/delete_category', DeleteCategory);
router.post('/admin/delete_voucher', DeleteVoucher); 
router.post('/admin/foodImg_update',upload.single('image'), ImgFoodUpload);
router.post('/admin/update_food', UpdateFoods);
router.post('/admin/delete_food', DeleteFood);
router.post('/admin/insert_food', InsertFoods);
router.get('/admin/get_users', getUsers);
router.post('/admin/user_active', setUserActive);
export default router;