process.env.NODE_ENV = 'test';

const userService = require('../services/userService');
const bookingService = require('../services/bookingService');
const roomService = require('../services/roomService');
const courseService = require('../services/coursesService');
const lectureService = require('../services/lectureService');

const chai = require('chai');
const server = require('../index');
const should = chai.should();
const chaiHttp = require("chai-http");

const moment = require('moment');

chai.use(chaiHttp);

describe('Booking routes', function () {
    before('Create db', async function() {

        await userService.createUserTable();
        await courseService.createCoursesTable();
        await lectureService.createLecturesTable();
        await roomService.createRoomsTable();
        await bookingService.createBookingTable();
        const newTeacher = { university_id:'1',email: 'tea@test.com',  password: "Secret!;;0",name:'mario', surname:'rossi', role: "teacher" };
        const course1 = { code: '1', name: 'Software Engineering 2', teacher_id: '1'};
        const newStudent = { university_id:'2',email: 'tea2@test.com',  password: "Secret!;;0",name:'gino', surname:'rossi', role: "student" };
      
        let res = await userService.insertUser(newTeacher);
        should.exist(res);
        res.should.equal(1);
        
        res = await userService.insertUser(newStudent);
        res.should.equal(2);

        res = await courseService.addCourse(course1);
        res.should.equal(1);

        const room1 = {name: 'Room1', seats: 100};
        let res2 = await roomService.addRoom(room1);
        res2.should.equal(1)

        let time = moment().format("YYYY-MM-DD hh:mm:ss");
        const lecture1 = {datetime: time, course_id:1, room_id: 1};
        let res3 = await lectureService.addLecture(lecture1);
        res3.should.equal(1);

    });

    it('should allow student to book a lecture', async function() {
        const newBooking = { lecture_id: 1, student_id: 2};
        
        const tmp = `/students/${newBooking.student_id}/bookings`;

        let res4 = await chai.request(server).post(tmp).send({lecture_id: newBooking.lecture_id});
        should.exist(res4);
        res4.should.have.status(201);    
        res4.body.should.be.an('object');
        const response = {lecture_id:1,student_id:2};
        res4.body.should.be.eql(response);
    });

    it('should not allow student to book a lecture', async function() {
        const newBooking = { lecture_id: 1, student_id: 2};
        
        const tmp = `/students/${newBooking.student_id}/bookings`;

        let res4 = await chai.request(server).post(tmp).send({lecture_id: newBooking.lecture_id});
        should.exist(res4);
        res4.should.not.have.status(201);
        res4.body.should.be.an('object');
    });



    after('Delete db',async function() {
        await userService.deleteUsers();
        await roomService.deleteRooms();
        await courseService.deleteCourses();
        await lectureService.deleteLectures();
        await bookingService.deleteBookings();
    });
});
