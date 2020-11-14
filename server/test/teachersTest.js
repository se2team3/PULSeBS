const userService = require('../services/userService');
const teacherService = require('../services/teachersService');
const roomService = require('../services/roomService');
const courseService = require('../services/coursesService');
const lectureService = require('../services/lectureService');

const chai = require('chai');
const server = require('../index');
const should = chai.should();
const chaiHttp = require("chai-http");

const moment = require('moment');

chai.use(chaiHttp);

describe('Teachers routes', function () {
    before('Create db', async function() {
        await userService.createUserTable();
        await courseService.createCoursesTable();
        await lectureService.createLecturesTable();
        await roomService.createRoomsTable();
    });

    it('should retrieve all the lectures for a teacher in a given time frame', async function() {
        const newUser = { university_id:'1',email: 'tea@test.com',  password: "Secret!;;0",name:'mario', surname:'rossi', role: "teacher" };
        const course1 = { code: '1', name: 'Software Engineering 2', teacher_id: '1'};
        const course2 = { code: '2', name: 'prova', teacher_id: '1'};
        const course3 = { code: '3', name: 'prova2', teacher_id: '1'};
        let res = await userService.insertUser(newUser);
        should.exist(res);
        res.should.equal(1);

        res = await courseService.addCourse(course1);
        res.should.equal(1);
        res = await courseService.addCourse(course2);
        res.should.equal(2);
        res = await courseService.addCourse(course3);
        res.should.equal(3);

        let time = moment().format("YYYY-MM-DD hh:mm:ss");
        console.log(time);

        const room1 = {name: 'Room1', seats: 100};
        const room2 = {name: 'Room2', seats: 100};
        const room3 = {name: 'Room3', seats: 100};
        
        res = await roomService.addRoom(room1);
        res = await roomService.addRoom(room2);
        res = await roomService.addRoom(room3);

        const lecture1 = {datetime: time, course_id:1, room_id: 1};
        const lecture2 = {datetime: time, course_id:2, room_id: 2};
        const lecture3 = {datetime: time, course_id:3, room_id: 3};

        res = await lectureService.addLecture(lecture1);
        res = await lectureService.addLecture(lecture2);
        res = await lectureService.addLecture(lecture3);

        let yesterday = moment().add(1,'days').format("YYYY-MM-DD hh:mm:ss");
        let tomorrow = moment().add(-1,'days').format("YYYY-MM-DD hh:mm:ss");
        res = await teacherService.getLecturesByTeacherAndTime('1',yesterday,tomorrow)

        res.should.be.an('array');
    });

    after('Delete db',async function() {
        await userService.deleteUsers();
        await roomService.deleteRooms();
        await courseService.deleteCourses();
        await lectureService.deleteLectures();
    });
});