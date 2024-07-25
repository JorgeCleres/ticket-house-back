import request from 'supertest';
import { describe, expect, it } from '@jest/globals';
import jwt from 'jsonwebtoken';
import app from '../../app.js';

import dotenv from 'dotenv';
dotenv.config();
const secret = process.env.JWT_SECRET;

describe('POST em /register', () => {
    it('Deve criar um usuário', async () => {
        const usuario = {
            nome: "Giovana",
            email: "g@hotmail.com",
            password: "Arrumar torneira",
            grupo: 0
        };

        const resp = await request(app)
            .post('/register')
            .send(usuario)
            .expect(201);

        expect(resp.body.message).toBe('Usuário registrado com sucesso');
    });

    it('Deve informar que o email já está cadastrado', async () => {
        const usuario = {
            nome: "Giovana",
            email: "g@hotmail.com",
            password: "Arrumar torneira",
            grupo: 0
        };

        const resp = await request(app)
            .post('/register')
            .send(usuario)
            .expect(400);

        expect(resp.body.message).toBe('Desculpe, esse email já está registrado');
    });
});

describe('POST em /login', () => {
    let tokenUsuario = ''
    let usuarioverify = ''
    it('Deve retornar Usuário logado com sucesso', async () => {
        const usuario = {
            email: "g@hotmail.com",
            password: "Arrumar torneira",
        };

        const resp = await request(app)
            .post('/login')
            .send(usuario)
            .expect(201);

            tokenUsuario = resp.body.token
            usuarioverify = usuario
        expect(resp.body.message).toBe('Usuário logado com sucesso');
    });

    it('Deve verificar se o token é valido', () => {
        // Verificar se o token retornado é válido
        expect(tokenUsuario).toBeDefined();

        // Decodificar o token
        const decoded = jwt.verify(tokenUsuario, secret);
        expect(decoded).toBeDefined();
        expect(decoded.email).toBe(usuarioverify.email);
    })

    it('Deve retornar Erro ao realizar o login verificar se o email e senha estão corretos', async () => {
        const usuario = {
            email: "g2@hotmail.com",
            password: "Arrumar torneira 2",
        };

        const resp = await request(app)
            .post('/login')
            .send(usuario)
            .expect(400);

        expect(resp.body.message).toBe('Erro ao realizar o login, verificar se o email e senha estão corretos');
    });

    it('Deve deslogar', async () => {
        const resp = await request(app)
            .post('/logout')
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .expect(200);

        expect(resp.body.message).toBe('Logout realizado com sucesso');
    })
});