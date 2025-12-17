import {Router} from 'express';
import { addComment, getTicketComment } from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = Router();


router.use(authenticate)

router.post('/:ticketId/comment' , addComment)
router.get('/:ticketId/comment' , getTicketComment)



export default router;