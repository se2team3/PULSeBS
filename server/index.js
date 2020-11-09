require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const mail = require('./utils/mail');

const PORT = process.env.PORT || 3001;

app = new express();

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

mail.send({
    to: "email@address.com",
    subject: "Subject here",
    text: "Email body"
}).then(/*console.log*/).catch(console.error);

// test purposes
module.exports = { app };