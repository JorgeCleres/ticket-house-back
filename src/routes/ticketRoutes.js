import express from 'express';
import ticketController from '../controllers/ticketController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router
    .get('/tickets/:grupo', auth, ticketController.listarTickets)
    .post('/tickets', ticketController.cadastrarTicket)
    .delete("/tickets/:id", ticketController.excluirTicket)
    .put("/tickets/:id", ticketController.atualizarTicket)

export default router;