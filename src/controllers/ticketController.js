import { ticket } from '../models/Ticket.js';

class TicketController {

    static cadastrarTicket = async (req, res) => {
        try {
            const novoTicket = await ticket.create(req.body);
            res.status(201).json({
                message: 'Criado com sucesso',
                data: novoTicket
            });
        } catch (erro) {
            res.status(400).json({
                message: `falha ao cadastrar ticket`
            });
        }
    }

    static listarTickets = async (req, res) => {
        try {
            const grupo = req.params.grupo;

            console.log(grupo);
            
            const listaTickets = await ticket.find({grupo})
            
            console.log(listaTickets);

            res.status(200).json(listaTickets)
        } catch ( erro ) {
            res.status(500).json({
                message: `falha na requisição`
            })
        }
    }

    static excluirTicket = async (req, res) => {
        try {
            const id = req.params.id;
            const ticketDeleted = await ticket.findByIdAndDelete(id)
            if (!ticketDeleted) {
                return res.status(404).json({
                    message: 'Ticket não encontrado'
                });
            }
            res.status(200).json({
                message: 'Ticket excluído com sucesso'
            });
        } catch (erro) {
            res.status(500).json({
                message: `falha ao excluir ticket`
            })
        }
    }

    static atualizarTicket = async (req, res) => {
        try {
            const id = req.params.id;
            const ticketExistente = await ticket.findById(id);
            if (!ticketExistente) {
                return res.status(404).json({ message: 'Ticket não encontrado' });
            }
            const ticketUpdate = await ticket.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json({
                message: 'Ticket atualizado com sucesso',
                data: ticketUpdate
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Falha ao atualizar ticket' });
        }
    }
}

export default TicketController;