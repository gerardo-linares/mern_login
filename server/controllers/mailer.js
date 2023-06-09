import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';

// Configuración del transporte del correo
const nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: ENV.M_EMAIL,
        pass: ENV.M_PASSWORD,
    }
};

const transporter = nodemailer.createTransport(nodeConfig);

const MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
});

// Controlador para enviar correo de registro
export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    // Configuración del contenido del correo
    const email = {
        body: {
            name: {
                name: username,
                intro: text || 'Welcome to djalkdsa ahjsdhjasd asidkhaskda dahsdhadh',
                outro: 'Need help, or have questions? Just reply to this email, we love to help'
            }
        }

    };        

    // Generar el cuerpo HTML del correo
    const emailBody = MailGenerator.generate(email)

    // Configuración del mensaje de correo
    let message = {
        from: ENV.M_EMAIL,
        to: userEmail,
        subject: subject || "Codigo de autenticación",
        html: `<div>
        <p>
            ¡Hola, <strong>${username}}</strong>!
        </p>
        <p>
            Gracias por registrarte. Por favor, utiliza el siguiente código de verificación:
        </p>
        <p style="font-size: 24px; font-weight: bold; color: #0066cc;">{{verificationCode}}</p>
        <p>
            Ingresa el código en nuestro sitio web para completar tu proceso de registro.
        </p>
        <a href="https://example.com/verify">
            Verificar Código
        </a>
    </div>
    <div>
        <p>
            Si necesitas ayuda, por favor contacta a nuestro equipo de soporte en support@example.com
        </p>
    </div>`
    };

    // Enviar el correo
    transporter.sendMail(message)
        .then(() => { 
            // El correo se envió correctamente
            return res.status(200).send({ msg: "You should receive an email from us" }) 
        })
        .catch(error => {
            // Ocurrió un error al enviar el correo
            res.status(500).send({ error });
        });
};
