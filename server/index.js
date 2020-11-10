const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const studentsRoutes = require('./routes/student');

const PORT = 3001;

const app = new express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(`/`, studentsRoutes);

app.use((req, res) => {
    return res.status(500).end();
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
