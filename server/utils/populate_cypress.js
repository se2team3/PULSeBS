process.env.NODE_ENV = "test";
 
const lectureDao = require('../daos/lecture_dao');
const userDao = require('../daos/user_dao');
const roomDao = require('../daos/room_dao');
const courseDao = require('../daos/course_dao');
const bookingDao = require('../daos/booking_dao');
const course_studentDao = require('../daos/course_student_dao');

const moment = require('moment');
require('./db').reset({ create: true }).then();
/**
 * Create database tables (if they do not exist)
 * @returns {Promise<void>}
 */
const createTables = async () => {
    await Promise.allSettled([
        lectureDao.deleteLectureTable(),
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


const populate= async () => {
   
    // create data
    const counter = require('../utils/counter')();
    const data = {
        students:[
            {id:1,university_id:1,email: `MicheleGialli@pulsebs.com`,password: 'passw0rd',name: 'Michele',surname: 'Gialli',role: 'student'},
            {id:2,university_id:2,email: `MatteoVerdi@pulsebs.com`,password: 'passw0rd',name: 'Matteo',surname: 'Verdi',role: 'student'},
            {id:3,university_id:3,email: `SimonaBlu@pulsebs.com`,password: 'passw0rd',name: 'Simona',surname: 'Blu',role: 'student'},
            {id:4,university_id:4,email: `CarmenRossi@pulsebs.com`,password: 'passw0rd',name: 'Carmen',surname: 'Rossi',role: 'student'},
            {id:5,university_id:5,email: `SteveBrown@pulsebs.com`,password: 'passw0rd',name: 'Steve',surname: 'Brown',role: 'student'},

        ],
        teachers:[
            {id:1,university_id:91,email: 'GiovanniNeri@pulsebs.com',password: 'passw0rd',name: 'Giovanni',surname: 'Neri',role: 'teacher'},
            {id:2,university_id:92,email: 'AndreaRossi@pulsebs.com',password: 'passw0rd',name: 'Andrea',surname: 'Rossi',role: 'teacher'}
        ],
        rooms: [
            {id:1,name: 'Aula 1', seats: 5},
            {id:2,name: 'Aula 2', seats: 7},
        ],
        courses: [
            {id:1,code: 'SE2', name: 'Software Engineering ', teacher_id: 2 },
            {id:2,code: 'WA', name:'Web Application', teacher_id:1 }
        ],
        lectures:[
            {id:1,datetime: '2020-11-23 08:30:00.000+01:00',datetime_end: "2020-11-23 11:30:00.000+01:00",course_id: 1,"room_id": 1, virtual: false,
            deleted_at: null,course_name: "Software Engineering",teacher_name: "Andrea",teacher_surname: "Rossi",room_name: "Aula 1", max_seats: 5,booking_counter: 1},
            {id:2,datetime: '2020-11-28 08:30:00.000+01:00',datetime_end: "2020-11-28 11:30:00.000+01:00",course_id: 1,"room_id": 1, virtual: false,
            deleted_at: null,course_name: "Software Engineering",teacher_name: "Andrea",teacher_surname: "Rossi",room_name: "Aula 1", max_seats: 5,booking_counter: 0},
            {id:3,datetime: '2020-11-18 08:30:00.000+01:00',datetime_end: "2020-11-18 11:30:00.000+01:00",course_id: 1,"room_id": 1, virtual: false,
            deleted_at: null,course_name: "Software Engineering",teacher_name: "Andrea",teacher_surname: "Rossi",room_name: "Aula 1", max_seats: 5,booking_counter: 0},
            {id:4,datetime: '2020-12-02 08:30:00.000+01:00',datetime_end: "2020-12-02 11:30:00.000+01:00",course_id: 1,"room_id": 1, virtual: false,
            deleted_at: null,course_name: "Software Engineering",teacher_name: "Andrea",teacher_surname: "Rossi",room_name: "Aula 1", max_seats: 5,booking_counter: 0},
            {id:5,datetime: '2020-11-20 16:30:00.000+01:00',datetime_end: "2020-11-20 18:30:00.000+01:00",course_id: 2,"room_id": 2, virtual: false,
            deleted_at: null,course_name: "Web Application",teacher_name: "Giovanni",teacher_surname: "Neri",room_name: "Aula 2", max_seats: 7,booking_counter: 2},
            {id:6,datetime: '2020-11-27 16:30:00.000+01:00',datetime_end: "2020-11-27 18:30:00.000+01:00",course_id: 2,"room_id": 2, virtual: false,
            deleted_at: null,course_name: "Web Application",teacher_name: "Giovanni",teacher_surname: "Neri",room_name: "Aula 2", max_seats: 7,booking_counter: 0},
            {id:7,datetime: '2020-11-30 16:30:00.000+01:00',datetime_end: "2020-11-30 18:30:00.000+01:00",course_id: 2,"room_id": 2, virtual: false,
            deleted_at: null,course_name: "Web Application",teacher_name: "Giovanni",teacher_surname: "Neri",room_name: "Aula 2", max_seats: 7,booking_counter: 0},

        
        ]
        
    };

    // insert data

        for (let student of data.students)
            await userDao.insertUser(student);
        for (let teacher of data.teachers)
            await userDao.insertUser(teacher);
        for (let room of data.rooms)
            await roomDao.insertRoom(room);
        for (let course of data.courses)
            await courseDao.insertCourse(course);
        for (let lecture of data.lectures)
            await lectureDao.insertLecture(lecture);

        await course_studentDao.assingCourseToStudent({course_id:1,student_id:1});
        await course_studentDao.assingCourseToStudent({course_id:1,student_id:2});
        for (let student of data.students)
            await course_studentDao.assingCourseToStudent({course_id:2,student_id:student.id});
        

        await bookingDao.insertBooking({lecture_id:1,student_id:1})
        await bookingDao.insertBooking({lecture_id:5,student_id:1})
        await bookingDao.insertBooking({lecture_id:5,student_id:3})


       
    return data;
};

const add_student = async (email) => {
    const user = require('./db').studentObj('s12345');
    await userDao.insertUser(user);
    return user;
};

module.exports = { reset, createTables, populate, add_student }
