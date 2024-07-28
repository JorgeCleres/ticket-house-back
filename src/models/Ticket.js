import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const ticketSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, unique: true, default: () => new mongoose.Types.ObjectId() },
    solicitante: { type: String, required: true },
    solicitado: { type: String, required: true },
    tarefa: { type: String, required: true },
    prioridade: { type: String, required: true },
    grupo: { type: Number, required: true },
    ticket: { type: Number, unique: true },
    descricao: { type: String, required: true },
    status: { type: Number, required: true, default: 0 },
    dataFim: { type: Date, required: true }
}, { timestamps: true });

// Adiciona o plugin ao esquema e define o campo que será autoincremental
ticketSchema.plugin(AutoIncrement, { inc_field: 'ticket' });

const ticket = mongoose.model('tickets', ticketSchema);

export { ticket, ticketSchema };