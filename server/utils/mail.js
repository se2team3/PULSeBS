const { mail } = require('../config/config');
const nodemailer = require('nodemailer');

const options = {
    host: mail.host,
    port: mail.port,
    secure: true,
    auth: {
        user: mail.user,
        pass: mail.pass
    }
};

const defaults = {
    from: `"PULSeBS" <${process.env.NODEMAILER_EMAIL}>`, // sender address
};

// TODO: check if the 'mail' parameters are set
const transport = nodemailer.createTransport(options, defaults);

// TODO: handle error
// verify connection configuration
transport.verify(function(error) {
    if (error) throw new Error(error);
    console.log("Server is ready to send emails");
});

const send = async ({to, subject, text}, callback = _=>{}) => {
    const message = {to, subject, text};
    return transport.sendMail(message, callback());
};

const info = () => {
    console.log(options);
}

module.exports = { send, info };
