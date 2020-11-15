const mail = {
    host: process.env.NODEMAILER_SMTP,
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
    port: process.env.NODEMAILER_PORT || 465,
};

module.exports = { mail };