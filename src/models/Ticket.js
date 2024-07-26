import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, unique: true, default: () => new mongoose.Types.ObjectId() },
    solicitante: { type: String, required: true },
    solicitado: { type: String, required: true },
    tarefa: { type: String, required: true },
    grupo: { type: Number, required: true },
    descricao: { type: String, required: true },
    status: { type: Number, required: true, default: 0 },
    dataFim: { type: Date, required: true }
}, { timestamps: true });

const ticket = mongoose.model('tickets', ticketSchema);

export { ticket, ticketSchema };