process.env.NODE_ENV = 'test';
/* const userService = require('../services/userService');
const roomService = require('../services/roomService');
const courseService = require('../services/coursesService');
const lectureService = require('../services/lectureService'); */
const dbUtils = require('../utils/db');

const server = require('../index');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require("chai-http");

const moment = require('moment');

chai.use(chaiHttp);

describe('Teachers routes', function () {
    it('should retrieve all the lectures for a teacher in a given time frame', async function() {
        const teacher_id = 1;
        const route = `/api/teachers/${teacher_id}/lectures`;

        let yesterday = moment().add(1,'days').format("YYYY-MM-DD");
        let tomorrow = moment().add(-1,'days').format("YYYY-MM-DD");
        //res = await teacherService.getLecturesByTeacherAndTime('1',yesterday,tomorrow)

        let res = await chai.request(server).get(route).query({from: yesterday, to: tomorrow});
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.have.length(0);

        res = await chai.request(server).get(route).query({from: '11111', to: tomorrow});
        res.should.have.status(400);
        res.body.should.have.property('errors');
    });

    it('should retrieve an error if the parameter is wrong', async function() {
        const teacher_id = 'error';
        const route = `/api/teachers/${teacher_id}/lectures`;

        let yesterday = moment().add(1,'days').format("YYYY-MM-DD");
        let tomorrow = moment().add(-1,'days').format("YYYY-MM-DD");

        res = await chai.request(server).get(route).query({from: yesterday, to: tomorrow});
        res.should.have.status(400);
        
    });

    before('create tables and clear db', async function() {
        await dbUtils.reset();
    });

    after('clear db', async function() {
        await dbUtils.reset({ create: false });
    });
});