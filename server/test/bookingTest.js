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
  

});
describe('Assert bookings', function () {
    
    before('create tables and clear db', async function() {
        await dbUtils.reset();
        
    });

    after('clear db', async function() {
        await dbUtils.reset({ create: false });
    });

    it('should verify that the student is already booked for a specific lecture', async function() {
        const data = await populateDb.populate();
        const lecture_id = 1;
        const tmp = `/api/students/${lecture_id}`;     
        let credentials = {email:data.students[0].email, password:data.students[0].password};
        const agent = chai.request.agent(server);
        await agent.post(`/api/login`).send(credentials);
   
        let res = await agent.get(tmp);
        
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.bookable.should.be.equal(false);

       

    });
    it('should verify that a student can book a specific lecture', async function() {
        const data = await populateDb.populate();
        const lecture_id = 8;
        const tmp = `/api/students/${lecture_id}`;     

        let credentials = {email:data.students[0].email, password:data.students[0].password};
        const agent = chai.request.agent(server);
        await agent.post(`/api/login`).send(credentials);
        let res2 = await agent.get(tmp);
        res2.should.have.status(200);
        res2.body.should.be.an('object');
        res2.body.bookable.should.be.equal(true)
        
    });
});
