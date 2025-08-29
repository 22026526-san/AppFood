import express from 'express';
import {upload} from '../middlewares/upload.js'
import { updateUser, getUserInfo ,updateImgUser, updateFavourite, saveCart, setUserCart, getFavourites, getVouchers, OrderFood, getOrders, cancelOrders, ReviewsFood, updateExpoToken, getNotice, updateNotice} from '../controllers/user.controller.js'; 
const router = express.Router();

router.post('/user/update_user', updateUser);
router.post('/user/user_info',getUserInfo);
router.post('/user/img_update',upload.single('image'),updateImgUser)
router.post('/user/update_favourite',updateFavourite);
router.post('/user/save_cart',saveCart);
router.post('/user/set_cart',setUserCart);
router.post('/user/set_favourite',getFavourites);
router.post('/user/get_vouchers',getVouchers);
router.post('/user/order_foods',OrderFood);
router.post('/user/get_orders',getOrders);
router.post('/user/cancel_orders',cancelOrders);
router.post('/user/review_foods',ReviewsFood);
router.post('/push_expo_token',updateExpoToken);
router.post('/user/get_notice',getNotice);
router.post('/user/update_notices',updateNotice);
export default router;