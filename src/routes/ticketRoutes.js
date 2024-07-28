import express from 'express';
import ticketController from '../controllers/ticketController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router
    .get('/tickets/:grupo', auth, ticketController.listarTickets)
    .post('/tickets', auth, ticketController.cadastrarTicket)
    .delete("/tickets/:id", auth, ticketController.excluirTicket)
    .put("/tickets/:id", auth, ticketController.atualizarTicket)

export default router;