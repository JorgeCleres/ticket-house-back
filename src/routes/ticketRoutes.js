import express from 'express';
import ticketController from '../controllers/ticketController.js';

const router = express.Router();

router
    .get('/tickets', ticketController.listarTickets)
    .post('/tickets', ticketController.cadastrarTicket)
    .delete("/tickets/:id", ticketController.excluirTicket)
    .put("/tickets/:id", ticketController.atualizarTicket)

export default router;