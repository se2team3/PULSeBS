const lectureDao = require('../daos/lecture_dao');
const userDao = require('../daos/user_dao');
const roomDao = require('../daos/room_dao');
const courseDao = require('../daos/course_dao');
const bookingDao = require('../daos/booking_dao');
const course_studentDao = require('../daos/course_student_dao');

const moment = require('moment');

/**
 * Create database tables (if they do not exist)
 * @returns {Promise<void>}
 */
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

/**
 * Reset database tables, bringing them to an empty initial state
 * @param {object} options - Config options
 * @param {boolean} [options.create=true] - is for force the tables creation
 * @returns {Promise<void>}
 */
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

/**
 * Generates a pseudo-random string
 * @param {int} [len=10] - string length
 * @returns {string} - pseudo-random string
 */
const randomString = (len = 10) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let string = '';
    for(let i = 0; i < len; i++){
        string += chars[Math.floor(Math.random() * chars.length)];
    }
    return string;
};

/**
 * Generates a teacher object, with a fixed email
 * @param {int} university_id - unique ID
 * @returns {{password: string, role: string, university_id: int, surname: string, name: string, email: string}}
 */
const teacherObj = (university_id) => ({
    university_id,
    email: 'email@host.com',
    password: 'passw0rd',
    name: 'Micheal',
    surname: 'Jordan',
    role: 'teacher'
});

/**
 * Generates a student object, with a pseudo-random email
 * @param {int} university_id - unique ID
 * @returns {{password: string, role: string, university_id: int, surname: string, name: string, email: string}}
 */
const studentObj = (university_id) => ({
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

/**
 * Populates the db by inserting a lesson and booking students to it
 * @param {object} options - Config options
 * @param {int} [options.n_students=50] - number of students that want to book for the created lecture
 * @param {string} [options.datetime=today] - lecture's datetime (in `YYYY-MM-DD` format)
 * @returns {Promise<{teacher: {password: string, role: string, university_id: int, surname: string, name: string, email: string}, booked: number, course: {code: string, name: string}, students: {password: string, role: string, university_id: int, surname: string, name: string, email: string}[], lecture: {datetime: *}, room: {name: string, seats: number}}>}
 *          generated data object
 */
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