import User from '../models/User.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import SendEmail from '../service/sendEmail.js';
dotenv.config();

class Usuario {

    static cadastrarUsuario = async (req, res) => {
        try {
            let isUser = await User.find({ email: req.body.email })

            if (isUser.length > 0) {
                return res.status(400).json({ message: 'Desculpe, esse email já está registrado' })
            }
            const newUser = new User(req.body)
            const data = await newUser.save();
            const token = await newUser.generateAuthToken()

            res.status(201).json({ message: 'Usuário registrado com sucesso', data, token })
        } catch (erro) {
            res.status(400).json({
                message: 'Erro ao registrar usuário'
            })
        }
    }

    static loginUsuario = async (req, res) => {
        try {
            const email = req.body.email
            const password = req.body.password
            const user = await User.findByCredentials(email, password)
            if (!user) {
                return res.status(400).json({
                    message: 'Erro ao realizar o login, verificar se o email e senha estão corretos'
                });
            }

            const token = await user.generateAuthToken()
            res.status(201).json({ message: 'Usuário logado com sucesso', user, token })

        } catch (erro) {
            res.status(400).json({
                message: 'Erro ao realizar o login, verificar se o email e senha estão corretos'
            })
        }
    }

    static logoutUsuario = async (req, res) => {
        try {
            const user = req.user
            const token = req.token
            await user.removeToken(token)
            res.status(200).json({ message: 'Logout realizado com sucesso' })
        } catch (erro) {
            res.status(500).json({
                message: 'Erro ao realizar o logout'
            })
        }
    }

    static getUsuarios = async (req, res) => {
        try {
            const grupo = req.params.grupo;
            const listaUsuarios = await User.find({ grupo }).select('nome email adm');
            res.status(200).json(listaUsuarios);
        } catch (erro) {
            res.status(500).json({
                message: `falha na requisição`
            })
        }
    }

    static editarUsuario = async (req, res) => {
        try {
            const id = req.params.id;

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }

            const userUpdate = await User.findByIdAndUpdate(id, req.body, { new: true });

            if (!userUpdate) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Retorna a resposta com o usuário atualizado
            res.status(200).json({
                message: 'Usuário atualizado com sucesso',
                data: userUpdate
            });
        } catch (erro) {
            res.status(500).json({
                message: `falha na requisição`
            })
        }
    }

    static removeUsuario = async (req, res) => {
        try {
            const id = req.params.id;
            const user = await User.findByIdAndDelete(id)

            if (!user) {
                return res.status(404).json({
                    message: 'Usuário não encontrado'
                });
            }
            res.status(200).json({
                message: 'Usuário excluído com sucesso'
            });

        } catch (erro) {
            res.status(500).json({
                message: `falha ao excluir usuário`
            })
        }
    }

    static recuperarSenha = async (req, res) => {
        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).json({
                    message: 'Usuário não encontrado'
                });
            }

            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 1800000;
            await user.save();
            SendEmail.notificacaoRecuperacaoSenha(user, token)
            res.status(201).json({
                message: 'Email enviado com sucesso'
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro} Falha ao recuperar senha`
            });
        }
    }

    static redefinirSenha = async (req, res) => {
        try {
            const token = req.params.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            let user = await User.findOne({ _id: decoded._id, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
            if (!user) {
                return res.status(400).json({
                    message: 'Token de redefinição de senha inválido ou expirado'
                });
            }

            user.password = await req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.status(200).json({ message: 'Senha redefinida com sucesso' });
        } catch (erro) {
            res.status(500).json({
                message: 'Falha ao redefinir senha'
            });
        }
    }
}

export default Usuario;