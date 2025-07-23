import express from 'express';
import { createUser,signUpGG_FB,sign_check_user, signup_update,UpdatePass } from '../controllers/signup.controller.js'; 
const router = express.Router();

router.post('/signup', createUser);
router.post('/signup_oath', signUpGG_FB);
router.post('/signup_check',sign_check_user);
router.post('/signup_update',signup_update);
router.post('/update_password',UpdatePass);

export default router;
