process.env.NODE_ENV = "populate";

const faker = require('faker/locale/it');
const moment = require('moment');
const userDao = require('../daos/user_dao');
const roomDao = require('../daos/room_dao');
const lectureDao = require('../daos/lecture_dao');
const courseDao = require('../daos/course_dao');

require('../utils/db').reset({ create: true }).then();

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
            this.university_id = `${idPrefix(role)}${faker.random.number()}`;
            this.name = faker.name.firstName();
            this.surname = faker.name.lastName();
            this.email = faker.internet.email(this.name, this.surname, 'pulsebs.com');
            this.password = faker.internet.password();
            this.role = role;
        };
        users.push(user);
        users_id.push(await userDao.insertUser(user));
    }
    return [ users, users_id ];
};

const generateRoom = async () => {
    const room = {
        name: `Aula ${faker.random.number(50)}`,
        seats: faker.random.number({ min: 50, max: 300 })
    };
    const room_id = await roomDao.insertRoom(room);
    return [ room, room_id ];
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

/* function calls */
(async () => {
    await generateUsers({ n: 200, role: "student" });
    const [teacher, teacher_id] = await generateUsers({ n: 1, role: "teacher" });
    const [course, course_id] = await generateCourse({ teacher_id: teacher_id[0] });
    const [room, room_id] = await generateRoom({ name: "Aula 1", seats: 300 });
    const [lecture, lecture_id] = await generateLecture({ course_id, room_id });
})();
