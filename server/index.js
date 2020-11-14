// require('dotenv').config({ path: './config/config.env' });
const express = require('express');
// const mail = require('./utils/mail');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const studentsRoutes = require('./routes/student');
const authenticateRoutes = require('./routes/authenticate');
const lectureRoute = require('./routes/lecturesRoute');
const teachersRoute = require('./routes/teachersRoute');
const errorHandler = require('./services/errorHandler');

const lectureDao = require('./daos/lecture_dao');
const courses_dao = require('./daos/course_dao');
const users_dao = require('./daos/user_dao');
const rooms_dao = require('./daos/room_dao');

const PORT = process.env.PORT || 3001;

const app = new express();
const swaggerOptions = require('./config/swaggerOptions');
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

app.use('/api-docs',swaggerOptions);
app.use('/', lectureRoute);
app.use(`/`, studentsRoutes);
app.use(`/`, teachersRoute);
app.use(`/`, authenticateRoutes);
app.use(errorHandler);

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

/* lectureDao.createLectureTable().then();
users_dao.createUsersTable().then();
courses_dao.createCourseTable().then();
rooms_dao.createRoomsTable().then(); */

/* mail.send({
    to: "email@address.com",
    subject: "Subject here",
    text: "Email body"
}).then().catch(console.error); */

// test purposes
module.exports = { app };