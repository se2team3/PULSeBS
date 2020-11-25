process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });
const dbUtils = require('../utils/db');

const chai = require('chai');
const server = require('../index');
const should = chai.should();
const chaiHttp = require("chai-http");
const BookingService = require ("../services/bookingService");
const populateDb = require('../utils/populate')

chai.use(chaiHttp);
/*
describe('Booking routes', function () {
    before('create tables and clear db', async function() {
        await dbUtils.reset();
    });

    after('clear db', async function() {
        await dbUtils.reset({ create: false });
    });

    it('should allow student to book a lecture', async function() {
        const newBooking = { lecture_id: 1, student_id: 2};
        
        const tmp = `/api/students/${newBooking.student_id}/bookings`;
        let res1 = await chai.request(server).post(tmp).send({lecture_id: newBooking.lecture_id});
        should.exist(res1);
        res1.should.have.status(201);
        res1.body.should.be.an('object');
        const response = {lecture_id:1,student_id:2};
        res1.body.should.be.eql(response);
    });

    it('should not allow student to book a lecture', async function() {
        const newBooking = { lecture_id: 1, student_id: 2};
        
        const tmp = `/api/students/${newBooking.student_id}/bookings`;

        let res = await chai.request(server).post(tmp).send({lecture_id: newBooking.lecture_id});
        should.exist(res);
        res.should.not.have.status(201);
        res.body.should.be.an('object');
    });
  

});*/
describe('Assert bookings', function () {
    
    before('create tables and clear db', async function() {
        await dbUtils.reset();
        
    });

    after('clear db', async function() {
        await dbUtils.reset({ create: false });
    });

    it('should verify that the student is already booked for a specific lecture', async function() {
        const lecture_id = 1;
        const tmp = `/api/students/${lecture_id}`;       
        const students = await populateDb.populate();
        console.log(students[0].email, students[0].password)
        await chai.request(server).get('/login').send({email:students[0].email, password: students[0].password}); 
        let res = await chai.request(server).get(tmp).send(lecture_id);
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.bookable.should.be.equal(true)

        const lecture_id2 = 13;
        const tmp2 = `/api/students/${lecture_id}`;
        let res2 = await chai.request(server).get(tmp2).send(lecture_id2);
        res2.should.have.status(200);
        res2.body.should.be.an('object');
        res2.body.bookable.should.be.equal(false)

    });
    it('should verify that the student is already booked for a specific lecture', async function() {
        const lecture_id = 13;
        const tmp = `/api/students/${lecture_id}`;
        let res = await chai.request(server).get(tmp).send({user:2},lecture_id);
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.bookable.should.be.equal(false)

    });
});
