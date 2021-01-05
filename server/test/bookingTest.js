process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });
const dbUtils = require('../utils/db');

const chai = require('chai');
const server = require('../index');
const should = chai.should();
const chaiHttp = require("chai-http");
const populateDb = require('../utils/populate')
const moment = require('moment');
let data;


chai.use(chaiHttp);

const book = async function () {
    let credentials = { email: data.students[0].email, password: data.students[0].password };
    const agent = chai.request.agent(server);
    let resLogin = await agent.post(`/api/login`).send(credentials);

    let student_id = resLogin.body.id;

    const newBooking = { lecture_id: 1, student_id: student_id };
    const tmp = `/api/students/${newBooking.student_id}/bookings`;
    let res = await agent.post(tmp).send({ lecture_id: newBooking.lecture_id });
    should.exist(res);
    res.body.should.be.an('object');
    return res;

}

const deletion = async function () {
    let credentials = { email: data.students[0].email, password: data.students[0].password };
    const agent = chai.request.agent(server);
    let resLogin = await agent.post(`/api/login`).send(credentials);

    let student_id = resLogin.body.id;
    // console.log(student_id);

    const newBooking = { lecture_id: 1, student_id: student_id };
    const tmp = `/api/students/${newBooking.student_id}/lectures/${newBooking.lecture_id}`;
    let res = await agent.delete(tmp).send();
    should.exist(res);
    res.body.should.be.an('object');
    return res.status;

}

describe('Booking routes', function () {
    before('create tables and clear db', async function () {
        await dbUtils.reset();
    });
    before('populate db', async () => {
        data = await dbUtils.populate();
    });

    it('should allow student to book a lecture', async function () {
        let credentials = { email: data.students[0].email, password: data.students[0].password };
        const agent = chai.request.agent(server);
        let resLogin = await agent.post(`/api/login`).send(credentials);
        let start_date = moment(new Date(2020, 10, 28, 16, 30)).format('YYYY-MM-DD');
        let end_date = moment(new Date(2020, 10, 31, 16, 30)).format('YYYY-MM-DD');

        
        const tmp = `/api/students/${resLogin.body.id}/lectures`;
        
        let res = await agent.get(tmp).query({ from: start_date, to: end_date });
        // console.log('BEFORE BOOKING:', res.body)
        
        res = await book();
        res.should.have.property('status', 201);
        
        res = await agent.get(tmp).query({ from: start_date, to: end_date });

        // console.log('AFTER BOOKING:', res.body)

    });

    it('should not allow student to book a lecture already booked', async function () {

        let credentials = { email: data.students[0].email, password: data.students[0].password };
        const agent = chai.request.agent(server);
        let resLogin = await agent.post(`/api/login`).send(credentials);
        let start_date = moment(new Date(2020, 10, 28, 16, 30)).format('YYYY-MM-DD'); // just for debug, can be removed if pass
        let end_date = moment(new Date(2020, 10, 31, 16, 30)).format('YYYY-MM-DD');// just for debug, can be removed if pass

        
        const tmp = `/api/students/${resLogin.body.id}/lectures`; // just for debug, can be removed if pass
        
        
        // let res = await agent.get(tmp).query({ from: start_date, to: end_date });
        // console.log('SECOND FUNCTION:', res.body)

        res = await book();
        res.should.not.have.property('status', 201);
        res.should.have.property('status',400);

        // res = await agent.get(tmp).query({ from: start_date, to: end_date });
        // console.log('AFTER FUNCTION :', res.body)
    });

    it('should allow student to delete a booking', async function () {

        let credentials = { email: data.students[0].email, password: data.students[0].password };
        const agent = chai.request.agent(server);
        let resLogin = await agent.post(`/api/login`).send(credentials);
        const tmp = `/api/students/${resLogin.body.id}/lectures`;

        let start_date = moment(new Date(2020, 10, 28, 16, 30)).format('YYYY-MM-DD');
        let end_date = moment(new Date(2020, 10, 31, 16, 30)).format('YYYY-MM-DD');

        let res = await agent.get(tmp).query({ from: start_date, to: end_date });

        // console.log('BEFORE DELETE: ', res.body)

        res = await deletion();
        res.should.be.equal(200);

        res = await agent.get(tmp).query({ from: start_date, to: end_date });

        // console.log('AFTER DELETE: ', res.body)

    });



    it('should not allow student to delete a booking yet deleted', async function () {
        let res = await deletion();
        res.should.not.be.equal(200);
        res.should.be.equal(304);
    });

    it('should allow student to book a lecture for which he deleted his booking before', async function () {
        let res = await book();
        res.should.have.property('status', 201);

    });


    it('should put a student in the waiting list', async function () {
        let credentials = { email: data.students[1].email, password: data.students[1].password };
        const agent = chai.request.agent(server);
        let resLogin = await agent.post(`/api/login`).send(credentials);

        let student_id = resLogin.body.id;
        const newBooking = { lecture_id: 1, student_id: student_id };
        let tmp = `/api/students/${newBooking.student_id}/bookings`;
        let res = await agent.post(tmp).send({ lecture_id: newBooking.lecture_id });

        res.body.should.have.property('waiting', true);
    });

    it('should check the waiting list count of a lecture', async function () {
        // One student is already in the waiting list
        let credentials = { email: data.students[2].email, password: data.students[2].password };
        const agent = chai.request.agent(server);
        let resLogin = await agent.post(`/api/login`).send(credentials);

        let student_id = resLogin.body.id;
        const newBooking = { lecture_id: 1, student_id: student_id };
        let tmp = `/api/students/${newBooking.student_id}/bookings`;
        let res = await agent.post(tmp).send({ lecture_id: newBooking.lecture_id });

        res.body.should.have.property('waiting', true);

        let start_date = moment(new Date(2020, 10, 28, 16, 30)).format('YYYY-MM-DD');
        let end_date = moment(new Date(2020, 10, 31, 16, 30)).format('YYYY-MM-DD');


        credentials = { email: data.students[0].email, password: data.students[0].password };
        resLogin = await agent.post(`/api/login`).send(credentials);
        tmp = `/api/students/${resLogin.body.id}/lectures`;

        res = await agent.get(tmp).query({ from: start_date, to: end_date });
        res.body[0].should.have.property('waiting_counter',2)
    });

});
describe('Assert bookings', function () {

    before('create tables and clear db', async function () {
        await dbUtils.reset();

    });

    it('should verify that the student is already booked for a specific lecture', async function () {
        const data = await populateDb.populate();
        const lecture_id = 1;
        let credentials = { email: data.students[0].email, password: data.students[0].password };
        const agent = chai.request.agent(server);
        await agent.post(`/api/login`).send(credentials);

        const tmp = `/api/students/${lecture_id}`;
        let res = await agent.get(tmp);

        res.should.have.status(200);
        res.body.should.be.an('object');
        // FIXME
        //res.body.bookable.should.be.equal(false);
    });

    it('should verify that a student can book a specific lecture', async function () {
        const data = await populateDb.populate();
        const lecture_id = 8;
        const tmp = `/api/students/${lecture_id}`;

        let credentials = { email: data.students[0].email, password: data.students[0].password };
        const agent = chai.request.agent(server);
        await agent.post(`/api/login`).send(credentials);
        let res2 = await agent.get(tmp);
        res2.should.have.status(200);
        res2.body.should.be.an('object');
        res2.body.bookable.should.be.equal(true)

    });
});