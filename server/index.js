require('dotenv').config({ path: './config/config.env' });
const express = require('express');

const PORT = process.env.PORT || 3001;

app = new express();

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

const mail = require('./utils/mail');

mail.send({
    to: "s276294@asdasdasd.polito.it",
    subject: "New email",
    text: "Nuovo testo, leggi qua"
})
.then(console.log)
.catch(console.error);