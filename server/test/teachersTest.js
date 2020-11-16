process.env.NODE_ENV = 'test';
const userService = require('../services/userService');
const roomService = require('../services/roomService');
const courseService = require('../services/coursesService');
const lectureService = require('../services/lectureService');
const dbUtils = require('../utils/db');

const server = require('../index');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require("chai-http");

const moment = require('moment');

chai.use(chaiHttp);

describe('Teachers routes', function () {
    it('should retrieve all the lectures for a teacher in a given time frame', async function() {
        const teacher_id = 1;
        const route = `/teachers/${teacher_id}/lectures`;

        let yesterday = moment().add(1,'days').format("YYYY-MM-DD");
        let tomorrow = moment().add(-1,'days').format("YYYY-MM-DD");
        //res = await teacherService.getLecturesByTeacherAndTime('1',yesterday,tomorrow)

        let res = await chai.request(server).get(route).query({start_date: yesterday, end_date: tomorrow});
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.have.length(3);

        res = await chai.request(server).get(route).query({start_date: '11111', end_date: tomorrow});
        res.should.have.status(400);
        res.body.should.have.property('errors');
    });

    before('create tables and clear db', async function() {
        await dbUtils.reset();

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

        const room1 = {name: 'Room1', seats: 100};
        const room2 = {name: 'Room2', seats: 100};
        const room3 = {name: 'Room3', seats: 100};
        
        res = await roomService.addRoom(room1);
        res.should.equal(1);
        res = await roomService.addRoom(room2);
        res.should.equal(2);
        res = await roomService.addRoom(room3);
        res.should.equal(3);

        const lecture1 = {datetime: time, course_id:1, room_id: 1};
        const lecture2 = {datetime: time, course_id:2, room_id: 2};
        const lecture3 = {datetime: time, course_id:3, room_id: 3};

        res = await lectureService.addLecture(lecture1);
        res.should.equal(1);
        res = await lectureService.addLecture(lecture2);
        res.should.equal(2);
        res = await lectureService.addLecture(lecture3);
        res.should.equal(3);
    });

    after('clear db', async function() {
        await dbUtils.reset({ create: false });
    });
});