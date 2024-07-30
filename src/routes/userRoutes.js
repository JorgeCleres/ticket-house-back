import express from 'express';
import userController from '../controllers/userController.js'
import auth from '../middleware/auth.js';

const router = express.Router();

router
    .get('/usuarios/:grupo', auth, userController.getUsuarios)
    .post('/register', userController.cadastrarUsuario)
    .put('/register/:id', auth, userController.editarUsuario)
    .post('/login', userController.loginUsuario)
    .post('/logout', auth , userController.logoutUsuario)

export default router