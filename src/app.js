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

const corsOptions = {
    origin: 'http://localhost:5173', // Atualize com a URL do seu frontend
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Certifique-se de que 'Content-Type' e 'Authorization' estão permitidos
};

app.use(cors(corsOptions));

// Middleware para adicionar cabeçalhos CORS manualmente
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Responder a solicitações preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

export default app;