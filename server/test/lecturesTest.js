process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });

const moment = require('moment');
const dbUtils = require('../utils/db');
const lectureServices = require('../services/lectureService');

const chai = require('chai');
const should = chai.should();
const server = require('../index');
const chaiHttp = require("chai-http");
chai.use(chaiHttp);


describe('Lecture testing', function() {
    before('create tables and clear db', async function() {
        await dbUtils.reset();
    });

    beforeEach('clear db', async function() {
        await dbUtils.reset({ create: false });
    });

    after('clear db', async function() {
        await dbUtils.reset({ create: false });
    });

    describe('Lecture services', async function() {
        it('should retrieve the list of tomorrow lectures', async function() {
            const tomorrow = moment().add(1,'days').format('YYYY-MM-DD');
            const data = await dbUtils.populate({ n_students: 50, datetime: tomorrow });
            const res = await lectureServices.getNextDayLectures();
            should.exist(res);
            res.should.be.an('array').that.has.length(1);
            const response = {
                teacher: { email: data.teacher.email, name: data.teacher.name, surname: data.teacher.surname },
                course: { code: data.course.code, name: data.course.name },
                date: data.lecture.datetime,
                room: data.room_id,
                bookings: data.booked
            };
            res.should.be.eql([response]);
        });

        it('should retrieve an empty list for Sundays lecture', async function() {
            // populate db
            await dbUtils.populate();
            const daysToSunday = +moment().startOf('isoWeek').add(1, 'week').fromNow('day').split(" ")[0];
            const res = await lectureServices.getNextDayLectures(daysToSunday);
            should.exist(res);
            res.should.be.an('array').that.has.length(0);
        });
    });

    describe('Lecture Routes', async function(){

        it('should get the list of booking given a lecture', async function() {
            const lectureObj = { lecture_id: 1};
            
            const tmp = `/api/lectures/${lectureObj.lecture_id}/bookings`;
            await dbUtils.populate();

            let res = await chai.request(server).get(tmp).send();
            should.exist(res);
            res.should.have.status(200);
            res.body.should.be.an('array');
        });

        it('should get the extended lecture given the id', async function() {
            const lectureObj = { lecture_id: 1};
            
            const tmp = `/api/lectures/${lectureObj.lecture_id}`;
            await dbUtils.populate();

            let res = await chai.request(server).get(tmp).send();
            should.exist(res);
            res.should.have.status(200);
            res.body.should.be.an('object');
        });

        it('should get the list of lectures in a time frame given the student', async function() {
            const student_id = 1;
            const start_date = '2020-11-23';
            const end_date = '2020-11-29';

            const data = await dbUtils.populate();

            const student1 = data.students[0];
            const credentials = {email: student1.email, password: student1.password }
            // perform login
            const agent = chai.request.agent(server);
            await agent.post('/api/login').send(credentials);
            
            const url = `/api/students/${student_id}/lectures`;

            let res = await agent.get(url).query({from: start_date, to: end_date});
            should.exist(res);
            res.should.have.status(200);
            res.body.should.be.an('array');
        });

        it('should NOT get the list of lectures in a time frame given the student (unauthorized)', async function() {
            const student_id = 1;
            const start_date = '2020-11-23';
            const end_date = '2020-11-29';

            await dbUtils.populate();

            const url = `/api/students/${student_id}/lectures`;

            const agent = chai.request.agent(server);
            let res = await agent.get(url).query({from: start_date, to: end_date});
            should.exist(res);
            res.should.have.status(401);
        });

        it('should get the list of lectures in a INVALID time frame given the student', async function() {
            const student_id = 1;
            const start_date = '2020-11-23';
            const end_date = '2020-11-33'; // invalid date

            const data = await dbUtils.populate();

            const student1 = data.students[0];
            const credentials = {email: student1.email, password: student1.password }
            // perform login
            const agent = chai.request.agent(server);
            await agent.post('/api/login').send(credentials);
            
            const url = `/api/students/${student_id}/lectures`;

            let res = await agent.get(url).query({from: start_date, to: end_date});
            should.exist(res);
            res.should.have.status(400);
        });
    })

});
