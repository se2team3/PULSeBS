require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const mailserver = require('./utils/mail');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const swaggerOptions = require('./config/swaggerOptions');
const studentsRoutes = require('./routes/studentRoute');
const authenticateRoutes = require('./routes/authenticateRoute');
const lectureRoutes = require('./routes/lecturesRoute');

const errorHandler = require('./services/errorHandler');
const bookingRoute = require('./routes/bookingsRoute');

const PORT = process.env.PORT || 3001;

const app = new express();

app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

app.use('/api-docs', ...swaggerOptions);
app.use('/', lectureRoutes);
app.use(`/`, studentsRoutes);
app.use(`/`, authenticateRoutes);
app.use(`/`, bookingRoute);

app.use(errorHandler);

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

mailserver.start((error) => {
    if (error)
        throw new Error(error);
    if (process.env.NODE_ENV !== "test")
        console.log("Server is ready to send emails");
});

const sendEveryTenSeconds = '*/10 * * * * *';
mailserver.job().start();

// test purposes
module.exports = app;
