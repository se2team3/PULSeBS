process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });
const dbUtils = require('../utils/db');
const moment = require('moment');

const chai = require('chai');
const server = require('../index');
const should = chai.should();
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const book=async function () {
    const newBooking = { lecture_id: 1, student_id: 2};
    const tmp = `/api/students/${newBooking.student_id}/bookings`;
    let res = await chai.request(server).post(tmp).send({lecture_id: newBooking.lecture_id});
    should.exist(res);
    res.body.should.be.an('object');
    return res.status;
        
}

const deletion =async function(){
    const newBooking = { lecture_id: 1, student_id: 2};
        const tmp = `/api/students/${newBooking.student_id}/lectures/${newBooking.lecture_id}`;
        let res = await chai.request(server).delete(tmp).send();
        should.exist(res);
        res.body.should.be.an('object');
        return res.status;

}

describe('Booking routes', function () {
    before('create tables and clear db', async function() {
        await dbUtils.reset();
    });

    after('clear db', async function() {
        await dbUtils.reset({ create: false });
    });

    it('should allow student to book a lecture', async function() {
        let res=await book();
        res.should.be.equal(201);
    });

    it('should not allow student to book a lecture already booked', async function() {
        let res=await book();
        res.should.not.be.equal(201);
    });

    it('should allow student to delete a booking', async function() {
        let res= await deletion();
        res.should.be.equal(200);
      
    });

    

    it('should not allow student to delete a booking yet deleted', async function() {
        let res= await deletion();
        res.should.be.equal(304);
        
    });

    it('should allow student to book a lecture for which he deleted his booking before', async function() {
        let res=await book();
        res.should.be.equal(201);
        
    });

});
