import express from 'express';
import { createUser,signUpGG_FB } from '../controllers/signup.controller.js'; 
const router = express.Router();

router.post('/signup', createUser);
router.post('/signup_oath', signUpGG_FB);

export default router;
