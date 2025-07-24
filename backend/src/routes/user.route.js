import express from 'express';
import { updateUser, getUserInfo } from '../controllers/user.controller.js'; 
const router = express.Router();

router.post('/user/update_user', updateUser);
router.post('/user/user_info',getUserInfo)
export default router;