/* process.env.NODE_ENV = "populate";

const faker = require('faker/locale/it');
const moment = require('moment');
const userDao = require('../daos/user_dao');
const roomDao = require('../daos/room_dao');
const lectureDao = require('../daos/lecture_dao');
const courseDao = require('../daos/course_dao');
const courseStudentDao = require('../daos/course_student_dao');
const bookingDao = require('../daos/booking_dao');

require('./db').reset({ create: true }).then();

const idPrefix = (role) => {
    const __prefix = {
        "student": "s",
        "teacher": "d",
    };
    return __prefix[role] || "?";
};

const generateUsers = async ({ n = 50, role = "student" } = {}) => {
    const users = [];
    const users_id = [];
    for (let i = 0; i < n; i++) {
        const user = new function() {
            this.university_id = `${idPrefix(role)}${faker.random.number({ min: 0, max: 3000 })}`;
            this.name = faker.name.firstName();
            this.surname = faker.name.lastName();
            this.email = faker.internet.email(this.name, this.surname, 'pulsebs.com');
            this.password = faker.internet.password();
            this.role = role;
        };
        try {
            users_id.push(await userDao.insertUser(user));
            users.push(user);
        }   catch(e) {
        }
    }
    return [ users, users_id ];
};

const generateRoom = async ({n}) => {
    let vector_id=[];
    let vector_room=[];
    for(let i=0;i<n;i++){
        const room = {
            name: `Aula ${faker.random.number(50)}`,
            seats: faker.random.number({ min: 50, max: 300 })
        };
        const room_id = await roomDao.insertRoom(room);
        vector_id.push(room_id);
        vector_room.push(room);
    }
    return [vector_room,vector_id];
};

const generateCourse = async ({ teacher_id }) => {
    const course = {
        code: faker.random.alphaNumeric(5),
        name: faker.lorem.words(),
        teacher_id: teacher_id
    };
    const course_id = await courseDao.insertCourse(course);
    return [ course, course_id ];
};

const generateLecture = async ({ inDays = faker.random.number(20), course_id, room_id } = {}) => {
    const lecture = {
        datetime: moment().add(inDays, 'days').format('YYYY-MM-DD HH:MM:SS'),
        course_id: course_id,
        room_id: room_id
    };
    const lecture_id = await lectureDao.insertLecture(lecture);
    return [ lecture, lecture_id ];
};

const assignCourse = async ({course_id,student_id})=>{
    return (await courseStudentDao.assingCourseToStudent({course_id,student_id}));
}


const bookLecture = async ({ lecture_id, student_id }) => {
    const resp = await bookingDao.isBookable(student_id,lecture_id);
    if (resp.bookable){
        const booking_id = await bookingDao.insertBooking({lecture_id,student_id});
        return booking_id;
    };
    return null;
}


(async () => {
    const [students, students_id] = await generateUsers({ n: 200, role: "student" });
    const [teachers, teachers_id] = await generateUsers({ n: 5, role: "teacher" });
    console.log(`Students: `);
    students.forEach(s => console.log(`  email: ${s.email}, password: ${s.password}`));
    console.log(`Teacher: `);
    teachers.forEach(t => console.log(`  email: ${t.email}, password: ${t.password}`));
    const [rooms, rooms_id] = await generateRoom({n:10});
    let count = 0;
    for (let teacher_id of teachers_id) {
        const [course, course_id] = await generateCourse({ teacher_id });
        const n = 50;
        const selected = students_id.sort(() => 0.5 - Math.random()).slice(0, n);
        for (let student_id of selected) {
            await assignCourse({course_id, student_id});
        }
        const n_lectures = 10;
        for (let i = 0; i < n_lectures; i++) {
            const room_id = rooms_id[faker.random.number({min:0, max:rooms_id.length - 1})];
            const [lecture, lecture_id] = await generateLecture({ course_id, room_id });
            const booked = selected.sort(() => 0.5 - Math.random()).slice(0, n_lectures);
            for (let student_id of booked) {
                await bookLecture({lecture_id, student_id});
            }
        }
    }
})();



 */