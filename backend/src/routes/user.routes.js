import {Router} from 'express';
import { getMe, Login, Logout, Register } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = Router();

router.post('/register' , Register)
router.post('/login', Login)
router.get('/logout' ,authenticate ,Logout)
router .get('/me', authenticate , getMe)



export default router;