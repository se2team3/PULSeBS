require('dotenv').config({ path: './config/config.env' });

const { MailSlurp } = require('mailslurp-client');
const mail = require('../utils/mail');
const chai = require('chai');
const should = chai.should();

/* describe('Email testing', function() {
    let inbox, mailSlurp;

    before('', async function () {
        mailSlurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });
        inbox = await mailSlurp.createInbox();
    });

    describe('Validate email address', function () {
        it('should have the proper email addresses', async function () {
            mail.send({
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
            mail.send({
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