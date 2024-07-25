import express from 'express';
import userController from '../controllers/userController.js'
import auth from '../middleware/auth.js';

const router = express.Router();

router
    .post('/register', userController.cadastrarUsuario)
    .post('/login', userController.loginUsuario)
    .post('/logout', auth , userController.logoutUsuario)

export default router