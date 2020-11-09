require('dotenv').config({ path: './config/config.env' });

const { MailSlurp } = require('mailslurp-client');
const mail = require('../utils/mail');

const mailSlurp = new MailSlurp({ apiKey: "c52ea2ac57d3aa5429a38d131f06a25382bf0739505f3345dc21f4fac93363b0" });

(async function() {
    const inbox = await mailSlurp.createInbox();
    mail.send({
        to: inbox.emailAddress,
        subject: "[test] from nodejs",
        text: "aw shit here we go again",
    }).then().catch(console.error);
    const email = await mailSlurp.waitForLatestEmail(inbox.id, 30000, true);
    console.log(email);
})();
