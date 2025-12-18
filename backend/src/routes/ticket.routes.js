import {Router} from 'express';
import { assignTicket, createTicket, getAllTicket, getTicket, getTicketByAgent, getUserTicket, updateTicket, } from '../controllers/ticket.controller.js';
import {authenticate , authorize}  from '../middleware/auth.middleware.js'
const router = Router();

router.use(authenticate)
router.post('/' ,authorize('user') ,createTicket) //1
router.get('/my-tickets' , authorize('user'), getUserTicket ) //7
router.get('/assigned', authorize('agent'), getTicketByAgent) //4
router.patch('/:ticketId/status', authorize('agent','admin'), updateTicket) //5
router.get('/', authorize('admin'), getAllTicket) //2
router.post('/:ticketId/assign', authorize('admin'), assignTicket) //3 
router.get('/:ticketId', authorize('admin'), getTicket) //6



export default router;