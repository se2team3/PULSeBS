 process.env.NODE_ENV = "populate";

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
            let user_id = await userDao.insertUser(user);
            user.id = user_id;
            users.push(user);
        }   catch(e) {
        }
    }
    return users;
};

const generateRoom = async ({n}) => {
    let vector_id=[]; 
    // let vector_room=[]; removed code smell, unused field
    for(let i=0;i<n;i++){
        const room = {
            name: `Aula ${faker.random.number(50)}`,
            seats: faker.random.number({ min: 50, max: 300 })
        };
        const room_id = await roomDao.insertRoom(room);
        vector_id.push(room_id);
        //vector_room.push(room);
    }
    return vector_id;
};

const generateCourse = async ({ teacher_id }) => {
    const course = {
        code: faker.random.alphaNumeric(5),
        name: faker.lorem.words(),
        teacher_id: teacher_id
    };
    const course_id = await courseDao.insertCourse(course);
    return course_id ;
};

const startingHour = ["08:30", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
const duration = [90, 180];

const generateLecture = async ({ inDays = faker.random.number(20), course_id, room_id } = {}) => {
    const start = startingHour[faker.random.number(startingHour.length - 1)];
    const datetime = moment(start, "hh:mm").add(inDays, 'days');
    const lecture = {
        datetime: datetime.format('YYYY-MM-DD HH:mm'),
        datetime_end: datetime.add(duration[faker.random.number(1)], 'minutes').format('YYYY-MM-DD HH:mm'),
        course_id: course_id,
        room_id: room_id
    };
    const lecture_id = await lectureDao.insertLecture(lecture);
    return lecture_id;
};

const assignCourse = async ({course_id,student_id})=>{
    return (await courseStudentDao.assingCourseToStudent({course_id,student_id}));
}


const bookLecture = async ({ lecture_id, student_id }) => {
    const resp = await bookingDao.isBookable(student_id,lecture_id);
    if (resp.bookable){
        const booking_id = await bookingDao.insertBooking({lecture_id,student_id});
        return booking_id;
    }
    return null;
}


const populate = (async () => {
    const students = await generateUsers({ n: 10, role: "student" });
    const teachers = await generateUsers({ n: 1, role: "teacher" });
    const rooms_id = await generateRoom({n:10});

    let teachers_id = teachers.map((t)=>t.id);
    let students_id = students.map((s) => s.id);


    for (let teacher_id of teachers_id) {
        const course_id = await generateCourse({ teacher_id });
        const n = 10;
       // const selected = students_id.sort(() => 0.5 - Math.random()).slice(0, n);
        for (let student_id of students_id) {
            await assignCourse({course_id, student_id});
        }
        const n_lectures = 10;
        for (let i = 0; i < n_lectures; i++) {
            const room_id = rooms_id[faker.random.number({min:0, max:rooms_id.length - 1})];
            const lecture_id = await generateLecture({ course_id, room_id });
            //const booked = selected.sort(() => 0.5 - Math.random()).slice(0, n_lectures);
            
            const dim = students_id.length /2 ;
            if(i<dim){
                let j=0;
                for (let student_id of students_id) {       
                    if(j<dim) {
                        j++; 
                        await bookLecture({lecture_id, student_id});
                    }
                        
                }
            
            }
        }
    }
    return {students,students_id};
});
module.exports = {populate};


