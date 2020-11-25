process.env.NODE_ENV = 'test';
const dbUtils = require('../utils/db');

const server = require('../index');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require("chai-http");

const moment = require('moment');
const db = require('../utils/db');

chai.use(chaiHttp);
/*
describe('Student routes', function () {
    
    before('create tables and clear db', async function() {
        await dbUtils.reset();
        await db.populate();
    });

    after('clear db', async function() {
        await dbUtils.reset({ create: false });
    });

    it('should retrieve all the extended lectures for a student in a given time frame', async function() {
        const student_id = 2;
        const tmp = `/api/students/${student_id}/lectures`;
        let start_date = moment("2020-11-25","YYYY-MM-DD").format("YYYY-MM-DD");
        let end_date = moment("2020-12-27","YYYY-MM-DD").format("YYYY-MM-DD");
    
        let res = await chai.request(server).get(tmp).query({from: start_date, to: end_date});
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.have.length(1);

        res = await chai.request(server).get(tmp).query({from: '11111', to: end_date});
        res.should.have.status(400);
        res.body.should.have.property('errors');
    });

    it(`should retrieve an empty array for the student's extended lectures`, async function() {
        const student_id = 2;
        const tmp = `/api/students/${student_id}/lectures`;
        let start_date = moment("2020-11-27","YYYY-MM-DD").format("YYYY-MM-DD");
        let end_date = moment("2020-12-28","YYYY-MM-DD").format("YYYY-MM-DD");
    
        let res = await chai.request(server).get(tmp).query({from: start_date, to: end_date});
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.have.length(0);

        res = await chai.request(server).get(tmp).query({from: '11111', to: end_date});
        res.should.have.status(400);
        res.body.should.have.property('errors');
    });
});
*/