import nodemailer from 'nodemailer';

class SendEmail {
    static createTransporter() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.titan.email',
            port: process.env.EMAIL_PORT || 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }

    static async sendMail(mailOptions) {
        const transporter = this.createTransporter();
        try {
            await transporter.sendMail(mailOptions);
            return { status: 200, message: 'Email enviado com sucesso' };
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return { status: 500, message: 'Erro ao enviar email' };
        }
    }

    static notificacaoRecuperacaoSenha(user, token) {
        const fullPath = `${process.env.BASE_URL}/Reset/${token}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Recuperação de senha',
            text: `Você está recebendo isso porque você (ou alguém) solicitou a redefinição da senha da sua conta.\n\n` +
                  `Clique no link a seguir ou cole no seu navegador para completar o processo:\n\n` +
                  `${fullPath}\n\n` +
                  `Se você não solicitou isso, ignore este email e sua senha permanecerá inalterada.\n`,
            html: `<p>Você está recebendo isso porque você (ou alguém) solicitou a redefinição da senha da sua conta.</p>` +
                  `<p><a href="http://${fullPath}">Clique aqui</a> ou cole o link abaixo no seu navegador para completar o processo:</p>` +
                  `<p><a href="http://${fullPath}">http://${fullPath}</a></p>` +
                  `<p>Se você não solicitou isso, ignore este email e sua senha permanecerá inalterada.</p>`
        };
    
        return this.sendMail(mailOptions);
    }
    

    static notificacaoTicket(dados, usuario) {
        const mailOptions = {
            to: usuario.email,
            from: process.env.EMAIL,
            subject: 'Ticket Aberto',
            text: `Você está recebendo isso porque o ${dados.solicitante} abriu um ticket para você\n\n` +
                  `Tarefa: ${dados.tarefa}\n\n` +
                  `Prazo: ${dados.dataFim}\n\n`,
            html: `<p>Você está recebendo isso porque o <strong>${dados.solicitante}</strong> abriu um ticket para você.</p>` +
                  `<p><strong>Tarefa:</strong> ${dados.tarefa}</p>` +
                  `<p><strong>Prazo:</strong> ${dados.dataFim}</p>`
        };

        return this.sendMail(mailOptions);
    }
}

export default SendEmail;
