import express from 'express';
import { getAllTopRate, getCategory, getFoodCard, getFoodInfo, getFoodPopular, getFoodwithCategory, getVouchers, SearchFood } from '../controllers/food.controller.js';

const router = express.Router();

router.post('/food/get_info', getFoodInfo);
router.get('/food/get_foodcard', getFoodCard);
router.post('/food/get_food_with_category', getFoodwithCategory);
router.get('/food/get_alltoprate', getAllTopRate);
router.get('/food/get_popular', getFoodPopular);
router.post('/food/voucher', getVouchers);
router.post('/food/search', SearchFood);
router.get('/food/get_category', getCategory);

export default router;