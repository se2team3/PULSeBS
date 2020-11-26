require('dotenv').config({ path: './config/config.env' });

process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });

const { MailSlurp } = require('mailslurp-client');
const mailserver = require('../utils/mail');
const chai = require('chai');
const should = chai.should();
const mockery = require('mockery');
const assert = require('assert');
const nodemailerMock = require('nodemailer-mock');
var EmailUtils;

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
            EmailUtils.start()

        });

        afterEach(async () => {
            nodemailerMock.mock.reset();
        });

        after(async () => {
            // Remove our mocked nodemailer and disable mockery
            mockery.deregisterAll();
            mockery.disable();
        });

        it('should send a confirmation booking email ', async () => {
            const booking ={lecture_id:1,student_id:1}
           EmailUtils.notifyBooking(booking).then((res)=>res.should.have.property("response", "nodemailer-mock success")).catch((err)=> console.log(err))          
        });

        
        it ("should verify that the confirmation booking email cannot be sent because the to is a nullish value", async()=>{           
              EmailUtils.notifyBooking(null,null).then((res)=>console.log(res)).catch((err)=> err.should.equal("Undefined recipient"))
        });
    })
})