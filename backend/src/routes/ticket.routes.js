import {Router} from 'express';
import { assignTicket, createTicket, getAllTicket, getTicket, getTicketByAgent, getUserTicket, updateTicket, } from '../controllers/ticket.controller.js';
import {authenticate , authorize}  from '../middleware/auth.middleware.js'
const router = Router();

router.use(authenticate)
router.post('/' ,authorize('user') ,createTicket)
router.get('my-tickets' , authorize('user'), getUserTicket )
router.get('/assigned', authorize('agent'), getTicketByAgent)
router.patch('/:ticketId/status', authorize('agent','admin'), updateTicket)
router.get('/', authorize('admin'), getAllTicket)

router.post('/:ticketId/assign', authorize('admin'), assignTicket)
router.get('/:ticketId', authorize('user'), getTicket)



export default router;