import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, unique: true, default: () => new mongoose.Types.ObjectId() },
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    grupo: { type: Number },
    adm: { type: Number, default: 0 },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    tokens: [
        { 
            token: { type: String, required: true }
        }
    ]
}, {
    timestamps: true,
    collection: 'users'
});

// Middleware para atualizar o valor de `grupo` e hash da senha
userSchema.pre('save', async function(next) {
    const user = this;

    // Se a senha estiver sendo modificada
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    // Se o valor de `grupo` estiver vazio
    if (user.isNew && (user.grupo == null || user.grupo === '')) {
        try {
            // Pegue o contador para o próximo valor
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'grupo' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }
            );

            user.grupo = counter.sequence_value;
        } catch (error) {
            return next(error);
        }
    }

    next();
});

// Método para remover um token
userSchema.methods.removeToken = async function(token) {
    const user = this;
    user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();
};

// Método para gerar o token no esquema do usuário
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, secret);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

// Método estático para encontrar um usuário por credenciais
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Login inválido');
    }

    // Validando a senha digitada com a senha do banco
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error('Senha inválida');
    }

    return user;
};

const Counter = mongoose.model('Counter', new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }
}));

const User = mongoose.model('User', userSchema);

export default User;
