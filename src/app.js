import express from 'express';
import conectaNaDataBase from './config/dbConnect.js';
import routes from './routes/index.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const conexao = await conectaNaDataBase();
conexao.on("error", (erro) => {
    console.error("Erro de conexão", erro);
});
conexao.once("open", () => {
    console.log('Conexão com o banco feita com sucesso');
});

const app = express();

// Configurar CORS para múltiplas origens
const corsOptions = {
    origin: ['https://jrgcleres.com.br', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Permitir métodos específicos e cabeçalhos
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Suas outras configurações de middleware
app.use(express.json());

// Definir as rotas após configurar o CORS e outros middlewares
routes(app);

export default app;
