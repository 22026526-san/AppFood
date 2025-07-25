import express from 'express';
import {upload} from '../middlewares/upload.js'
import { updateUser, getUserInfo ,updateImgUser} from '../controllers/user.controller.js'; 
const router = express.Router();

router.post('/user/update_user', updateUser);
router.post('/user/user_info',getUserInfo);
router.post('/user/img_update',upload.single('image'),updateImgUser)
export default router;