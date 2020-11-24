process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });
const dbUtils = require('../utils/db');

const chai = require('chai');
const server = require('../index');
const should = chai.should();
const chaiHttp = require("chai-http");

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
        const parameters = {email:'Floriana.Pichler45@pulsebs.com', password:'G8Cu0VUVk2wqaPR' }
         await chai.request(server).post('/api/login').send(parameters);
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

    it('should allow student to delete a booking', async function() {
        const newBooking = { lecture_id: 1, student_id: 2};
        
        const tmp = `/api/students/${newBooking.student_id}/delete_booking`;
        let res1 = await chai.request(server).post(tmp).send({lecture_id: newBooking.lecture_id});
        should.exist(res1);
        res1.should.have.status(201);
        res1.body.should.be.an('object');
        res1.body.number.should.be.eql(1);
    });

    

    it('should not allow student to delete a booking', async function() {
        const newBooking = { lecture_id: 1, student_id: 2};
        
        const tmp = `/api/students/${newBooking.student_id}/delete_booking`;

        let res = await chai.request(server).post(tmp).send({lecture_id: newBooking.lecture_id});
        should.exist(res);
        res.should.have.status(201);
        res.body.should.be.an('object');
        res.body.number.should.be.eql(0);
    });

});
