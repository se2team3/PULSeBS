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
const agent = chai.request.agent(server);

chai.use(chaiHttp);

const login = async function (student_index){
    let credentials = { email: data.students[student_index].email, password: data.students[student_index].password };
    let resLogin = await agent.post(`/api/login`).send(credentials);
    return resLogin;
}

const book = async function (student_index) {
    let student_id = data.students[student_index].university_id;
    const newBooking = { lecture_id: 1, student_id: student_id };
    const tmp = `/api/students/${newBooking.student_id}/bookings`;
    let res = await agent.post(tmp).send({ lecture_id: newBooking.lecture_id });
    should.exist(res);
    res.body.should.be.an('object');
    return res;

}

const deletion = async function (student_index) {
    let student_id = data.students[student_index].university_id;
    const newBooking = { lecture_id: 1, student_id: student_id };
    const tmp = `/api/students/${newBooking.student_id}/lectures/${newBooking.lecture_id}`;
    let res = await agent.delete(tmp).send();
    should.exist(res);
    res.body.should.be.an('object');
    return res.status;
}

const getStudentLectures = async function(student_index){
    const student_id = data.students[student_index].university_id;
    const start_date = moment(new Date(2020, 10, 28, 16, 30)).format('YYYY-MM-DD');
    const end_date = moment(new Date(2020, 10, 31, 16, 30)).format('YYYY-MM-DD');
    const tmp = `/api/students/${student_id}/lectures`;
    let res = await agent.get(tmp).query({ from: start_date, to: end_date });
    return res;
}

describe('Booking routes', function () {
    before('create tables and clear db', async function () {
        await dbUtils.reset();
        data = await dbUtils.populate();
    });

    it('should allow student to book a lecture', async function () {
        await login(0);        
        await getStudentLectures(0);
        let res = await book(0);
        res.should.have.property('status', 201);
    });

    it('should not allow student to book a lecture already booked', async function () {
        await login(0);
        let res = await book(0);
        res.should.not.have.property('status', 201);
        res.should.have.property('status',400);
    });

     it('should allow student to delete a booking', async function () {

        await login(0);
        // res = await getStudentLectures(0);
        let res = await deletion(0);
        res.should.be.equal(200);
        // res = await getStudentLectures(0);


    });



    it('should not allow student to delete a booking yet deleted', async function () {
        let res = await deletion(0);
        res.should.not.be.equal(200);
        res.should.be.equal(304);
    });

    it('should allow student to book a lecture for which he deleted his booking before', async function () {
        let res = await book(0);
        res.should.have.property('status', 201);

    });


    it('should put a student in the waiting list', async function () {
        let res = await login(1);
        res = await book(1);
        res.body.should.have.property('waiting', true);
    });

    it('should check the waiting list count of a lecture', async function () {
        // One student is already in the waiting list
        await login(2); // login with a third student

        await book(2);
        let res = await getStudentLectures(2);
        res.body[0].should.have.property('waiting_counter',2)
    });

   

    it('should pop someone from the waiting list when a booking is canceled', async function () {
        // One student is already in the waiting list
        await login(1);
    

        let res = await getStudentLectures(1);
        res.body[0].should.have.property('booking_waiting', true);
        res.body[0].should.have.property('waiting_counter',2)

        // login as a student booked before someone
        await login(0);
        res = await deletion(0);

        // student popped from waiting list
        await login(1);

        res = await getStudentLectures(1);

        res.body[0].should.have.property('booking_waiting', false);
        res.body[0].should.have.property('waiting_counter',1)

        // student still in the waiting list
        await login(2);
        res = await getStudentLectures(2);

        res.body[0].should.have.property('booking_waiting', true);
        res.body[0].should.have.property('waiting_counter', 1)


    });

});
describe('Assert bookings', function () {

    before('create tables and clear db', async function () {
        await dbUtils.reset();

    });

    it('should verify that the student is already booked for a specific lecture', async function () {
        data = await populateDb.populate();
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
        data = await populateDb.populate();
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