require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const mailserver = require('./utils/mail');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const swaggerOptions = require('./config/swaggerOptions');
const studentsRoutes = require('./routes/studentRoute');
const authenticateRoutes = require('./routes/authenticateRoute');
const lectureRoutes = require('./routes/lecturesRoute');
const teachersRoute = require('./routes/teachersRoute');
const setupRoute = require('./routes/setupRoute');

const errorHandler = require('./services/errorHandler');
const bookingRoute = require('./routes/bookingsRoute');

const PORT = process.env.PORT || 3001;

const app = new express();

// set higher limit for request size, needed for setup
app.use(express.json({extended: true, limit: '100mb'}));
app.use(express.urlencoded({extended: true, limit: '100mb'}));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

app.use('/api-docs', ...swaggerOptions);
app.use('/api/', lectureRoutes);
app.use(`/api/`, studentsRoutes);
app.use(`/api/`, authenticateRoutes);
app.use(`/api/`, bookingRoute);
app.use(`/api/`, teachersRoute);
app.use(`/api/`, setupRoute);

app.use(errorHandler);

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

const scheduledTime = '53 10 * * Sun-Thu';
mailserver.start();
mailserver.job().start();

// test purposes
module.exports = app;
