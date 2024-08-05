import express from 'express';
import userController from '../controllers/userController.js'
import auth from '../middleware/auth.js';

const router = express.Router();

router
    .post('/esqueceusenha', userController.recuperarSenha)
    .post('/redefinirSenha/:token', userController.redefinirSenha )
    .post('/register', userController.cadastrarUsuario)
    .put('/register/:id', auth, userController.editarUsuario)
    .post('/login', userController.loginUsuario)
    .post('/logout', auth , userController.logoutUsuario)
    .get('/usuarios/:grupo', auth, userController.getUsuarios)
    .delete('/usuarios/:id', auth, userController.removeUsuario)

export default router