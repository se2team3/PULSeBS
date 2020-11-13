const reset = async () => {
    await require('../daos/lecture_dao').clearLectureTable();
    await require('../daos/room_dao').clearRoomTable();
    await require('../daos/booking_dao').clearBookingTable();
    await require('../daos/course_dao').clearCourseTable();
    //await require('../daos/course_student').clearCourse_StudentTable();
    await require('../daos/user_dao').clearUserTable();
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

const studentObj = (university_id) => ({
    university_id,
    email: `${randomString()}@host.com`,
    password: 'passw0rd',
    name: 'Micheal',
    surname: 'Jordan',
    role: 'student'
});

module.exports = { reset, teacherObj, studentObj }