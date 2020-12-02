require('dotenv').config({ path: './config/config.env' });

process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });

const { MailSlurp } = require('mailslurp-client');
const chai = require('chai');
const should = chai.should();
const mockery = require('mockery');
const nodemailerMock = require('nodemailer-mock');
const mailFormatter = require('../utils/mailFormatter');
let EmailUtils;
let dbUtils;
let userService;
let lectureDao;
let bookingDao;


/*describe('Email testing', function() {
    let inbox, mailSlurp;
    before('', async function () {
        mailSlurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });
        inbox = await mailSlurp.createInbox();
    });
    describe('Validate email address', function () {
        it('should have the proper email addresses', async function () {
            this.timeout(30000);
            mailserver.send({
                to: inbox.emailAddress,
                subject: "Confirmation message",
                text: "text",
            }).then().catch(sendError);
            const email = await mailSlurp.waitForLatestEmail(inbox.id, 30000, true);
            email.from.should.be.a('string').eql(process.env.NODEMAILER_EMAIL);
            email.to.should.be.an('array');
            email.to.should.have.length(1);
            email.to[0].should.be.a('string').eql(inbox.emailAddress);
        });
        it('should have the proper email subject', async function () {
            this.timeout(30000);
            mailserver.send({
                to: inbox.emailAddress,
                subject: "Confirmation message",
                text: "text",
            }).then().catch(sendError);
            const email = await mailSlurp.waitForLatestEmail(inbox.id, 30000, true);
            email.subject.should.be.a('string').eql("Confirmation message");
        });
    });
});
const sendError = (err) => {
    console.error("Error in sending email", err);
    should.fail("Error in sending email with nodemailer.. asserting failure");
};
*/

describe('EmailService', function() {
    describe('Tests EmailService', async () => {

        before(async () => {
            // Enable mockery to mock objects
            mockery.enable({
                warnOnUnregistered: false,
                useCleanCache: true,
            });
            mockery.registerMock('nodemailer', nodemailerMock);
            EmailUtils = require('../utils/mail');
            dbUtils = require('../utils/db');
            userService = require("../services/userService");
            lectureDao = require("../daos/extended_lecture_dao");
            bookingDao = require("../daos/booking_dao");
            EmailUtils.start();
            await dbUtils.reset();
            await dbUtils.populate();

        });

        afterEach(async () => {
            nodemailerMock.mock.reset();
        });

        after(async () => {
            // Remove our mocked nodemailer and disable mockery
            mockery.deregisterAll();
            mockery.disable();
            await dbUtils.reset({create: false});
        });

        it('should send a confirmation booking email ', async () => {
            const booking ={lecture_id:1,student_id:1}
            const response = await EmailUtils.notifyBooking(booking);
            response.info.should.have.property("response", "nodemailer-mock success")          
        });

        
        it ("should verify that the confirmation booking email cannot be sent because the to is a nullish value", async()=>{           
              EmailUtils.notifyBooking(null,null).then((res)=>console.log(res)).catch((err)=> err.should.equal("Undefined recipient"))
        });

        it('the email shoul have a name, a course name, a datetime and a room ', async () => {
            const stud_id = 1;
            const lect_id = 1;
            const booking ={lecture_id:lect_id,student_id:stud_id}
            const response = await EmailUtils.notifyBooking(booking);
            
            const user = await userService.getUser(stud_id);
            const lecture = await lectureDao.getLectureById(lect_id);
       
            let regex = new RegExp(user.name + " " + user.surname);
            response.txt.should.match(regex);
            regex = new RegExp(lecture.course_name);
            response.txt.should.match(regex); 
            regex = new RegExp(lecture.datetime);
            response.txt.should.match(regex);  
            regex = new RegExp(lecture.room_name);
            response.txt.should.match(regex);         
         });

         it('should send cancellation email sent to students', async () => {
            const lecture = {lecture_id :1};

            const response = await EmailUtils.notifyLectureCancellation(lecture);
            
            const studentsList = await bookingDao.retrieveListOfBookedStudents(lecture.lecture_id);

            let studentsEmails = studentsList.map((s)=>s.email);

            let allstudentsReceived = response.every((email)=>studentsEmails.includes(email.to)); // everyone received the mail
            let studentsLength = studentsList.length; 
            response.should.be.a('array');
            response.should.have.length(studentsLength);
            allstudentsReceived.should.be.true;
         });

         it('should fail because of non-existing lecture', async () => {
            const lecture = {id :'dffdfdkkl'}; //invalid lecture id

            const response = await EmailUtils.notifyLectureCancellation(lecture);
                    
            response.should.have.property('message','Invalid lecture!');
         });

         it('should check cancellation email body', async () => {
            const lecture = {lecture_id :1};

            const response = await EmailUtils.notifyLectureCancellation(lecture);
            const lectureObj = await lectureDao.getLectureById(lecture.lecture_id);
            const studentsList = await bookingDao.retrieveListOfBookedStudents(lecture.lecture_id);

            let firstStudent = studentsList[0];
            let emailBody = mailFormatter.studentCancelledLectureBody(firstStudent,lectureObj);
            let firstMail = response[0];

            firstMail.text.should.equal(emailBody);
         });
        
    })
})
