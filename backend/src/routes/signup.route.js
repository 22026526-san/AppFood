import express from 'express';
import { createUser,signUpGG_FB,sign_check_user } from '../controllers/signup.controller.js'; 
const router = express.Router();

router.post('/signup', createUser);
router.post('/signup_oath', signUpGG_FB);
router.post('/signup_check',sign_check_user)

export default router;
