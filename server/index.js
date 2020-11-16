require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const mail = require('./utils/mail');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const swaggerOptions = require('./config/swaggerOptions');
const lectureRoute = require('./routes/lecturesRoute');
const studentsRoutes = require('./routes/student');
const authenticateRoutes = require('./routes/authenticateRoute');
const errorHandler = require('./services/errorHandler');
const bookingRoute = require('./routes/bookingsRoute');

const PORT = process.env.PORT || 3001;

const app = new express();

app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

app.use('/api-docs',...swaggerOptions);
app.use('/', lectureRoute);
app.use(`/`, studentsRoutes);
app.use(`/`, authenticateRoutes);
app.use(`/`, bookingRoute);

app.use(errorHandler);

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

mail.send({
    to: "email@address.com",
    subject: "Subject here",
    text: "Email body"
}).then(/*console.log*/).catch(console.error);

// test purposes
module.exports = app;
