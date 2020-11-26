process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });

const { MailSlurp } = require('mailslurp-client');
const mailserver = require('../utils/mail');
const chai = require('chai');
const should = chai.should();
const mailUtils = require("../utils/mail")
/*const mockery = require('mockery');
const nodemailerMock = require('nodemailer-mock');*/
const dbUtils = require('../utils/db');
const { mail } = require('../config/config');
const nodemailer = require('nodemailer');
/*const nodemailerTransport = require('nodemailer-mock-transport')
const userService = require("../services/userService");
const extendedLectureService = require("../services/extendedLectureService")*/
/*var mailUtils 
var dbUtils

const options = {
    host: mail.host,
    port: mail.port,
    secure: true,
    auth: {
        user: mail.user,
        pass: mail.pass
    }
};

const defaults = {
    from: `"PULSeBS" <${process.env.NODEMAILER_EMAIL}>`, // sender address
};
//const transport = nodemailerMock.createTransport(options,defaults);
//const transporter = nodemailerMock.createTransport(options,defaults)
*/
describe('Email testing', function() {
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

describe('Booking Email confirmation ', function() {
    
    
  before(async () => {
        // Enable mockery to mock objects
      /*  mockery.enable({
        warnOnUnregistered: false,
      */ });
    
        /* Once mocked, any code that calls require('nodemailer') 
        will get our nodemailerMock */
      /*  mockery.registerMock('nodemailer', nodemailerMock);
        mailUtils = require("../utils/mail")
        dbUtils = require('../utils/db');
        await dbUtils.reset();
        await dbUtils.populate()*/
       
    
    });

    afterEach(async () => {
        // Reset the mock back to the defaults after each test
  //      nodemailerMock.mock.reset();
    });

    after(async () => {
        // Remove our mocked nodemailer and disable mockery
     //   mockery.deregisterAll();
       // mockery.disable();
    });
    
    it('should send an email using nodemailer-mock', async () => {

/*        const booking ={lecture_id:1, student_id:1 }
        // call a service that uses nodemailer
    //    await mailUtils.notifyBooking(booking,"pulsebs@zohomail.com")
     //   mailUtils.send()  
     var transport = nodemailerTransport.mockTransport({
        foo: 'bar'
      });
   
      var transporter = nodemailer.createTransport(options,defaults);   


        const user = await userService.getUser(booking.student_id);
        const lecture = await extendedLectureService.getLectureById(booking.lecture_id);
        subj = mailUtils.__subject_for_booking(lecture);
        txt = mailUtils.__subject_for_booking(user,lecture);
        email = {
            to: "pulsebs@zohomail.com",
            subject: subj,
            text: lecture
        }      
        transporter.sendMail(email);
        // get the array of emails we sent
        
        
        const obj=mailUtils.send(email)
        console.log("obj",obj)
        const sentMail = nodemailerMock.mock.getSentMail();
        console.log(sentMail)
        // we should have sent one email
    //    sentMail.should.exist();
        
        // check the email for something
      //  sentMail[0].property.should.be.exactly('foobar');
    */    });



  /*  describe('Validate email address', function () {
        it('should have the proper email addresses', async function () {
            this.timeout(30000);
            const booking = {lecture_id: 1, student_id: 1};
            await mailUtils.notifyBooking(booking);
            const email = await mailSlurp.waitForLatestEmail(inbox.id, 30000, true);
            email.from.should.be.a('string').eql(process.env.NODEMAILER_EMAIL);
            console.log("mail.js line 63");
            email.to.should.be.an('object');
            email.to.should.be.a('string').eql(inbox.emailAddress);
        });

        it('should have the proper email subject', async function () {
            this.timeout(30000);
            const booking = {lecture_id: 1, student_id: 1};
            await mailUtils.notifyBooking(booking,inbox.emailAddress);
            const email = await mailSlurp.waitForLatestEmail(inbox.id, 30000, true);
            email.subject.should.be.a('string').eql(mailUtils.__subject_for_booking);
            
        });
        it('should have the proper email text', async function () {
            this.timeout(30000);
            const booking = {lecture_id: 1, student_id: 1};
            await mailUtils.notifyBooking(booking,inbox.emailAddress);
            const email = await mailSlurp.waitForLatestEmail(inbox.id, 30000, true);
            email.text.should.be.a('string').eql(mailUtils.__text_for_booking);
            
        });
    });
});
*/

const sendError = (err) => {
    console.error("Error in sending email", err);
    should.fail("Error in sending email with nodemailer.. asserting failure");
};
