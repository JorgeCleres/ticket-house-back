import express from 'express'
import conectaNaDataBase from './config/dbConnect.js'
import routes from './routes/index.js'
import cors from 'cors';

const conexao = await conectaNaDataBase();
conexao.on("error", (erro) => {
    console.error("Erro de conexão", erro);
});
conexao.once("open", () => {
    console.log('Conexão com o banco feita com sucesso');
})

const app = express();

routes(app);

// Permitir todas as origens
app.use(cors());

// Permitir métodos específicos e cabeçalhos
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Suas outras configurações de middleware e rotas
app.use(express.json());

export default app;