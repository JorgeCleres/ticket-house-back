import request from 'supertest';
import { describe, expect, it, jest} from '@jest/globals';
import app from '../../app.js'


let idResposta;
describe('POST em /tickets', () => {
    let conexao;
    afterAll(async () => {
        if (conexao) {
            await conexao.close();
        }
    });

    it('Deve adicionar um ticket', async () => {
        const novoTicket = {
            solicitante: "Giovana",
            solicitado: "Jorge",
            titulo: "Arrumar torneira",
            descricao: "Arrumar as torneiras da lavanderia",
            dataInicio: "2024-07-19",
            dataFim: "2024-07-28"
        };

        const resp = await request(app)
            .post('/tickets')
            .send(novoTicket)
            .expect(201);

        idResposta = resp.body.ticket._id;
        expect(resp.body.message).toBe('Criado com sucesso');
    });

    it('Deve retornar mensagem de falha ao tentar cadastrar com o body vazio', async () => {
        const resp = await request(app)
            .post('/tickets')
            .send({})
            .expect(400)
        expect(resp.body.message).toBe('falha ao cadastrar ticket');
    })
})

describe('GET em /tickets', () => {
    let conexao;
    afterAll(async () => {
        if (conexao) {
            await conexao.close();
        }
    });

    it('Deve retornar uma lista de tickets', async () => {
        const resp = await request(app)
            .get('/tickets')
            .set('Accept', 'application/json')
            .expect('content-type', /json/)
            .expect(200);

        expect(resp.body[0].solicitante).toEqual('Giovana')
    })

    it('Deve retornar undefined', async () => {
        const resp = await request(app)
            .get('/ticket')
            .expect(404);

        expect(resp.body.message).toBe(undefined);
    })
})

describe('Deve atulizar o ticket', () => {
    let conexao;
    afterAll(async () => {
        if (conexao) {
            await conexao.close();
        }
    });

    it('Deve retornar Ticket atualizado com sucesso', async () => {
        const ticket = {
            solicitado: "Juju"
        };

        const resp = await request(app)
            .put(`/tickets/${idResposta}`)
            .send(ticket)
            .expect(200);

        expect(resp.body.message).toBe('Ticket atualizado com sucesso');
    })

    it('Deve retornar Ticket não encontrado', async () => {
        const resp = await request(app)
        .put(`/tickets/669a970f0aade1f442d91ba6`)
			.expect(404);

        expect(resp.body.message).toBe('Ticket não encontrado');
    })
})

describe('Deve deletar o ticket pelo id', () => {
    let conexao;
    afterAll(async () => {
        if (conexao) {
            await conexao.close();
        }
    });

    it('Deve retornar Ticket excluído com sucesso', async () => {
        const resp = await request(app)
			.delete(`/tickets/${idResposta}`)
			.expect(200);

        expect(resp.body.message).toBe('Ticket excluído com sucesso');
    })

    it('Deve retornar Ticket não encontrado', async () => {
        const resp = await request(app)
        .delete(`/tickets/${idResposta}`)
			.expect(404);

        expect(resp.body.message).toBe('Ticket não encontrado');
    })

})