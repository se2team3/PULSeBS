const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const studentsRoutes = require('./routes/student');
const authenticateRoutes = require('./routes/authenticate');
const errorHandler = require('./services/errorHandler');

const PORT = 3001;

const app = new express();

app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

app.use(`/`, studentsRoutes);
app.use(`/`, authenticateRoutes);
app.use(errorHandler);

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

// test purposes
module.exports = app;