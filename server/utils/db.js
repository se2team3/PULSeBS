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
 * Checks if the db is in a (pseudo) empty state
 * @returns {Promise<void>}
 */
const isEmpty = async () => {
    return await lectureDao.isEmpty()
      && await bookingDao.isEmpty()
      && await courseDao.isEmpty()
      && await userDao.isEmpty()
      && await roomDao.isEmpty()
      && await course_studentDao.isEmpty();
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
 * @param {string} university_id - unique ID
 * @returns {{password: string, role: string, university_id: string, surname: string, name: string, email: string}}
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
 * Generates a manager object, with a fixed email
 * @param {string} university_id - unique ID
 * @returns {{password: string, role: string, university_id: string, surname: string, name: string, email: string}}
 */
const managerObj = {
    university_id: '200',
    email: 'manager@email.com',
    password: 'passw0rd',
    name: 'Francesco',
    surname: 'Verdi',
    role: 'manager'
};

/**
 * Generates a support officer object, with a fixed email
 * @param {string} university_id - unique ID
 * @returns {{password: string, role: string, university_id: string, surname: string, name: string, email: string}}
 */
const support_officerObj = {
    university_id: '201',
    email: 'officer@email.com',
    password: 'passw0rd',
    name: 'Micheal',
    surname: 'Jordan',
    role: 'officer'
};


/**
 * Generates a student object, with a pseudo-random email
 * @param {string} university_id - unique ID
 * @returns {{password: string, role: string, university_id: string, surname: string, name: string, email: string}}
 */
const studentObj = (university_id) => ({
    university_id,
    email: `${randomString()}@host.com`,
    password: 'passw0rd',
    name: 'Micheal',
    surname: 'Jordan',
    role: 'student'
});

const addStaff = async () => {
    await userDao.insertUser(support_officerObj);
    await userDao.insertUser(managerObj);
    return;
}

const def_options = {
    n_students: 5,
    datetime: moment(new Date(2020,10,29,16,30)).format('YYYY-MM-DD HH:mm'),
    
    
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
        room: {name: 'Aula 1', seats: 3},
        course: {code: 'SE2', name: 'Software Engineering 2', teacher_id: 1 },
        course2: {code: 'SE1', name:'Software Engineering 1', teacher_id: 1},
        assign1:{},
        assign2:{},
        lecture: { datetime },
        students: [...new Array(n_students)].map(() => studentObj(counter.get())),
        booked: 0
    };

    // insert data
    data.teacher_id = await userDao.insertUser(data.teacher);
    data.room_id = await roomDao.insertRoom(data.room);
    data.course.teacher_id = data.teacher_id;
    //data.course2.teacher_id=data.teacher_id;
    data.course_id = await courseDao.insertCourse(data.course);
    data.course2_id=await courseDao.insertCourse(data.course2);
    data.assign1.course_id = data.course_id
    data.assign2.course_id = data.course2_id
    // TODO check date format
    data.lecture.course_id = data.course_id;
    data.lecture.room_id = data.room_id;
    data.lecture_id = await lectureDao.insertLecture(data.lecture);
    data.students_id = [];
    for (let student of data.students) {
        const student_id = await userDao.insertUser(student);
        data.students_id.push(student_id);
        if(data.booked<45 && student_id > 4){   // for testing purposes, there are 3 seats, and 5 students. 2 will go in the waiting list
            data.booked++;
            await bookingDao.insertBooking({ lecture_id: data.lecture_id, student_id });
        }
    }
    data.assign1.student_id = data.students_id[0]
    data.assign2.student_id = data.students_id[0]

    await course_studentDao.assingCourseToStudent({ course_id: data.course_id, student_id: data.students_id[1] });
    await course_studentDao.assingCourseToStudent({ course_id: data.course_id, student_id: data.students_id[2] });
    await course_studentDao.assingCourseToStudent(data.assign1);
    await course_studentDao.assingCourseToStudent(data.assign2);

    return data;
};



/*const bookLectures = async() =>{
    let ripartition=3; //1 student over 3 is type A, 1 is type B, the other does nothing
    let factor_bookA= 4; //the student of type A books 1 lecture over 4 (only this type can cancel)
    let factor_bookB= 3; //the student of type B books 1 lecture over 3
    let factor_canc= 3; //1 deletion every 3 bookings
    let factor_stud= 5; //only 1 student over 5 (of type A) is cancelling some of his bookings
    try{
        const courses_students = await course_studentDao.retrieveAllStudentsCourses(); 
        const datetime= moment().format('YYYY-MM-DD HH:mm');
        let index=-1;
        let bookings=[];
        let deletions=[];
        let booking;
        let factor_book;
        let flag;
        let to_be_book, to_be_canc;

        for (let cs of courses_students){
            index++; 
            if(index%ripartition===0 || index%ripartition===1){
                if(index%ripartition===0)
                    factor_book=factor_bookA;
                else 
                    factor_book=factor_bookB;

                let lectures = await lectureDao.getLectures(cs.course_id) 

                for(let count=0;count<lectures.length;count++){
                    to_be_book=0;
                    to_be_canc=0;
                    flag=0;
                    if(count%factor_book===0){
                        to_be_book=1;
                        if(count%(factor_book*factor_canc)===0) {
                            to_be_canc=1; 
                            flag=1;
                        }
                        if(count%factor_bookA===0 && count%factor_bookB===0 && !(count%(factor_bookA*factor_canc)===0 && count%(factor_bookB*factor_canc)===0)){
                            to_be_canc=2;
                        }
                        booking=({lecture_id:lectures[count].id,student_id:cs.student_id, to_be_canc:to_be_canc})
                        bookings.push(booking);
                    }

                    if(to_be_book===1 && flag===1 && ((factor_book===factor_bookA && (index%(ripartition*factor_stud)===0)) ||(factor_book===factor_bookB && (index%(ripartition*factor_stud)===1)))){
                        deletions.push({datetime:datetime,lecture_id:booking.lecture_id,student_id:booking.student_id})  
                    }
                }
            }
        }
        await bookingDao.bulkBookings(bookings);
        await bookingDao.bulkDeletions(deletions);
    }
    catch(err){
        console.log(err)
    }

}*/
//module.exports = { reset, createTables, teacherObj, studentObj, managerObj, populate, support_officerObj, isEmpty, addStaff, bookLectures }
module.exports = { reset, createTables, teacherObj, studentObj, managerObj, populate, support_officerObj, isEmpty, addStaff }