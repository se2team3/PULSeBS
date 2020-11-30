process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });

const moment = require('moment');
const dbUtils = require('../utils/db');
const lectureServices = require('../services/lectureService');

const chai = require('chai');
const should = chai.should();
const server = require('../index');
const sinon= require('sinon');
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const deletion= async function (lecture_id){

    const t= dbUtils.teacherObj('1');
    const credentials={email:t.email, password:t.password}
    const agent = chai.request.agent(server);
    await agent.post(`/api/login`).send(credentials);

    const newLecture = { lecture_id: lecture_id };
    const tmp = `/api/lectures/${newLecture.lecture_id}`; 
    let res = await agent.delete(tmp).send();

    return res.status;
}
const updating= async function (lecture_id){

    const t= dbUtils.teacherObj('1');
    const credentials={email:t.email, password:t.password}
    const agent = chai.request.agent(server);
    await agent.post(`/api/login`).send(credentials);

    const newLecture = { lecture_id: lecture_id };
    const tmp = `/api/lectures/${newLecture.lecture_id}`; 
    let res = await agent.patch(tmp).send();
    return res.status;
}


describe('Lecture tests', function() {
    before('create tables and clear db', async function() {
        await dbUtils.reset();
    });

    after('clear db', async function() {
        await dbUtils.reset({ create: false });
    });

    describe('Lecture services', async function() {
        beforeEach('clear db', async function() {
            await dbUtils.reset({ create: false });
        });
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
        beforeEach('clear db', async function() {
            await dbUtils.reset({ create: false });
        });

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
            await testTimeFrame(true);
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
           await testTimeFrame(false);
        });
    })

    describe('Change a lecture to a virtual one',async function(){
        before('create tables,clear db and teacher login', async function() {
            await dbUtils.reset();
            await dbUtils.populate();
        })
        after('clear db', async function() {
            await dbUtils.reset({ create: false });
        });

        it('should not allow change lecture to virtual because it is a past lecture', async function() {
            var clock = sinon.useFakeTimers(new Date(2020, 10, 30, 16, 30));
            let res=await updating(1);
            res.should.be.equal(304);
            clock.restore(); 
        });    

        it('should not allow updating because it is remaining less than 30m', async function() {
            var clock = sinon.useFakeTimers(new Date(2020, 10, 29, 16, 20));
            let res=await updating(1);
            res.should.be.equal(304);
            clock.restore();
        });  

        it('should allow teacher to set a virtual lecture', async function() {
            var clock = sinon.useFakeTimers(new Date(2020, 10, 29, 14, 30));
            let res=await updating(1);
            res.should.be.equal(200);
            clock.restore();
        });

        it('should not allow teacher to set a virtual lecture that is already virtual', async function() {
            var clock = sinon.useFakeTimers(new Date(2020, 10, 29, 14, 30));
            let res=await updating(1);
            res.should.be.equal(304);
            clock.restore();
        });

        it('should not allow teacher to update a lecture with wrong parameters', async function() {
            var clock = sinon.useFakeTimers(new Date(2020, 10, 29, 14, 30));
            let res=await updating(undefined);
            res.should.be.equal(304);
            clock.restore();
        }); 
    })

    describe('Delete lectures test', async function(){
        before('create tables,clear db and teacher login', async function() {
            await dbUtils.reset();
            await dbUtils.populate();
        })
        after('clear db', async function() {
            await dbUtils.reset({ create: false });
        });

        it('should not allow deletion because it is a past lecture', async function() {
           var clock = sinon.useFakeTimers(new Date(2020, 10, 30, 16, 30));
           let res=await deletion(1);
           res.should.be.equal(304);
           clock.restore();

        });    

        it('should not allow deletion because it is remaining less than 1h', async function() {
           var clock = sinon.useFakeTimers(new Date(2020, 10, 29, 16, 20));
           let res=await deletion(1);
           res.should.be.equal(304);
           clock.restore();
        });    

        it('should allow teacher to delete a lecture', async function() {
           var clock = sinon.useFakeTimers(new Date(2020, 10, 29, 14, 30));
           let res=await deletion(1);
           res.should.be.equal(200);
           clock.restore();
        });

        it('should not allow teacher to delete a lecture that is already deleted', async function() {
            var clock = sinon.useFakeTimers(new Date(2020, 10, 29, 14, 30));
            let res=await deletion(1);
            res.should.be.equal(304);
            clock.restore();
        });

        it('should not allow teacher to delete a lecture with wrong parameters', async function() {
            var clock = sinon.useFakeTimers(new Date(2020, 10, 29, 14, 30));
            let res=await deletion(undefined);
            res.should.be.equal(304);
            clock.restore();
        }); 
    });
});

let testTimeFrame = async (validTimeFrame) => {
        const student_id = 1;
        const start_date = '2020-11-23';
        const end_date = validTimeFrame? '2020-11-29' /*valid*/: '2020-11-33'; // invalid date

        const data = await dbUtils.populate();

        const student1 = data.students[0];
        const credentials = {email: student1.email, password: student1.password }
        // perform login
        const agent = chai.request.agent(server);
        await agent.post('/api/login').send(credentials);
        
        const url = `/api/students/${student_id}/lectures`;

        let res = await agent.get(url).query({from: start_date, to: end_date});
        should.exist(res);
        res.should.have.status(validTimeFrame? 200: 400);
        if(validTimeFrame) res.body.should.be.an('array');
}