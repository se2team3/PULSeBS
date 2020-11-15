const lectureDao = require('../daos/lecture_dao');
const userDao = require('../daos/user_dao');
const roomDao = require('../daos/room_dao');
const courseDao = require('../daos/course_dao');
const bookingDao = require('../daos/booking_dao');
const course_studentDao = require('../daos/course_student');

const moment = require('moment');

const createTables = async () => {
    await Promise.allSettled([
        lectureDao.createLectureTable(),
        roomDao.createRoomsTable(),
        bookingDao.createBookingTable(),
        courseDao.createCourseTable(),
        course_studentDao.createCourse_StudentTable(),
        userDao.createUsersTable()
    ]);
}

const reset = async ({ create = true } = {}) => {
    if (create)
        await createTables();
    await Promise.allSettled([
        lectureDao.clearLectureTable(),
        roomDao.clearRoomTable(),
        bookingDao.clearBookingTable(),
        courseDao.clearCourseTable(),
        course_studentDao.clearCourse_StudentTable(),
        userDao.clearUserTable()
    ]);
};

const randomString = (len = 10) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let string = '';
    for(let i = 0; i < len; i++){
        string += chars[Math.floor(Math.random() * chars.length)];
    }
    return string;
};

const teacherObj = (university_id) => ({
    university_id,
    email: 'email@host.com',
    password: 'passw0rd',
    name: 'Micheal',
    surname: 'Jordan',
    role: 'teacher'
});

const studentObj = (university_id = 1) => ({
    university_id,
    email: `${randomString()}@host.com`,
    password: 'passw0rd',
    name: 'Micheal',
    surname: 'Jordan',
    role: 'student'
});

const def_options = {
    n_students: 50,
    datetime: moment().add(1,'days').format('YYYY-MM-DD'),
};

const populate = async ({n_students, datetime} = def_options) => {
    // creates entities
    const counter = require('../utils/counter')();
    const data = {
        teacher: teacherObj(counter.get()),
        room: {name: 'Aula 1', seats: 200},
        course: {code: 'SE2', name: 'Software Engineering 2' },
        lecture: { datetime },
        students: [...new Array(n_students)].map(() => studentObj(counter.get())),
        booked: 0
    };

    // insert data
    data.teacher_id = await userDao.insertUser(data.teacher);
    data.room_id = await roomDao.insertRoom(data.room);
    data.course.teacher_id = data.teacher_id;
    data.course_id = await courseDao.insertCourse(data.course);
    // TODO check date format
    data.lecture.course_id = data.course_id;
    data.lecture.room_id = data.room_id;
    data.lecture_id = await lectureDao.insertLecture(data.lecture);
    data.students_id = [];
    for (let student of data.students) {
        const student_id = await userDao.insertUser(student);
        data.students_id.push(student_id);
        data.booked++;
        await bookingDao.insertBooking({ lecture_id: data.lecture_id, student_id });
    }
    return data;
};

module.exports = { reset, createTables, teacherObj, studentObj, populate }