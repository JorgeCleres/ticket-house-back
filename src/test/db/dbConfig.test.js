import { describe, expect } from '@jest/globals';
import conectaNaDataBase from '../../config/dbConnect.js';

describe('Testando conexao', () => {
    let conexao;

    afterAll(async () => {
        if (conexao) {
            await conexao.close();
        }
    });

    it('Teste de conexao com o banco de dados', async () => {
        try {
            conexao = await conectaNaDataBase();
            conexao.on("error", (erro) => {
                console.error("Erro de conexão", erro);
                throw erro; // Lança erro para falhar o teste
            });
            conexao.once("open", () => {
                console.log('Conexão com o banco feita com sucesso');
            });

            // Aguardar a conexão ser estabelecida
            await new Promise((resolve, reject) => {
                conexao.once("open", resolve);
                conexao.on("error", reject);
            });

            expect(conexao.readyState).toBe(1); // Verifica se a conexão está aberta
        } catch (erro) {
            expect(erro).toBeNull(); // Se houver erro, falha o teste
        }
    });
});
