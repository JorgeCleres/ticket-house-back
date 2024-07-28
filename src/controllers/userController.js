import User from '../models/User.js'

class Usuario {

    static cadastrarUsuario = async (req, res) => {
        try {
            let isUser = await User.find({ email: req.body.email })
            if(isUser.length > 0) {
                return res.status(400).json({ message: 'Desculpe, esse email já está registrado'})
            }
            const newUser = new User(req.body)
            const user = await newUser.save();
            const token = await newUser.generateAuthToken()

            res.status(201).json({ message: 'Usuário registrado com sucesso', user, token })
        } catch(erro) {
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

        } catch(erro) {
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
            const listaUsuarios = await User.find({ grupo }).select('nome');
            res.status(200).json(listaUsuarios);
        } catch ( erro ) {
            res.status(500).json({
                message: `falha na requisição`
            })
        }
    }
}

export default Usuario;