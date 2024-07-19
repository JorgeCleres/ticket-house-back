import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, unique: true, default: () => new mongoose.Types.ObjectId() },
    solicitante: { type: String, required: true },
    solicitado: { type: String, required: true },
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    dataInicio: { type: Date, required: true },
    dataFim: { type: Date, required: true }
}, { timestamps: true });

const ticket = mongoose.model('tickets', ticketSchema);

export { ticket, ticketSchema };