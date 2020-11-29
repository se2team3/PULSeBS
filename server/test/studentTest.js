process.env.NODE_ENV = 'test';
const dbUtils = require('../utils/db');

const server = require('../index');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require("chai-http");

const moment = require('moment');
const db = require('../utils/db');
const coursesLectureService = require('../services/courseStudentService');
const coursesService = require('../services/coursesService');
const Course = require('../models/course');

let data;

chai.use(chaiHttp);

describe('Student routes', function () {
    
    before('create tables and clear db', async function() {
        await dbUtils.reset();
        data = await db.populate();
    });

 /*   after('clear db', async function() {
        await dbUtils.reset({ create: false });
    });

 */   it('should retrieve all the extended lectures for a student in a given time frame', async function() {     
        let credentials = {email:data.students[0].email, password:data.students[0].password};
      
        const agent = chai.request.agent(server);
        await agent.post(`/api/login`).send(credentials)       
        let courses = await coursesLectureService.getStudentCourses({student_id:data.students[0].university_id});
        let lectures = await coursesService.getLectures(courses[0].course_id)
        const datetime = lectures[0].datetime;
        console.log(datetime) 
       

        const tmp = `/api/students/${data.students[0].university_id}/lectures`;
        let start_date = moment(datetime,"YYYY-MM-DD ").subtract(1,'days').format("YYYY-MM-DD");
        let end_date = moment(datetime,"YYYY-MM-DD ").add(1,'days').format("YYYY-MM-DD");
        console.log(start_date,end_date)
        
        let res = await agent.get(tmp).query({from: start_date, to: end_date});
        
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.have.length(1);

        res = await agent.get(tmp).query({from: '11111', to: end_date});
        res.should.have.status(400);
        res.body.should.have.property('errors');
    });

    it(`should retrieve an empty array for the student's extended lectures`, async function() {
        let credentials = {email:data.students[0].email, password:data.students[0].password};
      
        const agent = chai.request.agent(server);
        await agent.post(`/api/login`).send(credentials)

        const tmp = `/api/students/${data.students[0].id}/lectures`;
        let start_date = moment("2021-11-27","YYYY-MM-DD").format("YYYY-MM-DD");
        let end_date = moment("2021-12-28","YYYY-MM-DD").format("YYYY-MM-DD");
    
        let res = await agent.get(tmp).query({from: start_date, to: end_date});
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.have.length(0);

        res = await agent.get(tmp).query({from: '11111', to: end_date});
        res.should.have.status(400);
        res.body.should.have.property('errors');
    });
});
