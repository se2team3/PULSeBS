process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });

const moment = require('moment');
const dbUtils = require('../utils/db');
const lectureServices = require('../services/lectureService');

const chai = require('chai');
const should = chai.should();
const server = require('../index');
const chaiHttp = require("chai-http");
const sinon= require('sinon');
chai.use(chaiHttp);


const deletion= async function (teacher_id,lecture_id){
    const newLecture = { teacher_id: teacher_id, lecture_id: lecture_id};
    const tmp = `/api/teachers/${newLecture.teacher_id}/lectures/${newLecture.lecture_id}`; 
    let res = await chai.request(server).delete(tmp).send();
    should.exist(res);
    res.body.should.be.an('object');
    return res.status;
}




describe('Lecture testing', function() {
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

    })
  

    describe('Delete lectures test', async function(){
        before('create tables and clear db', async function() {
            await dbUtils.reset();
            await dbUtils.populate();
        })

        it('should not allow deletion because it is a past lecture', async function() {
            var clock = sinon.useFakeTimers(new Date(2020, 10, 30, 16, 30));
            let res=await deletion(1,1);
            res.should.be.equal(304);
            clock.restore();
          
        });    

        it('should not allow deletion because it is remaining less than 1h', async function() {
            var clock = sinon.useFakeTimers(new Date(2020, 10, 29, 16, 20));
            let res=await deletion(1,1);
            res.should.be.equal(304);
            clock.restore();
        
        });    

        it('should allow teacher to delete a lecture', async function() {
            let res=await deletion(1,1);
            res.should.be.equal(200);
        });

    

        it('should not allow teacher to delete a lecture that is already deleted', async function() {
            let res=await deletion(1,1);
            res.should.be.equal(304);
            
        
        });

        it('should not allow teacher to delete a lecture with wrong parameters', async function() {
            let res=await deletion(undefined,undefined);
            res.should.be.equal(304);
        
        });

        

    
})
});
