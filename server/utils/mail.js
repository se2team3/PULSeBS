const { mail } = require('../config/config');
const nodemailer = require('nodemailer');
let transport;

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

/**
 * Starts the mail service
 * @param {function} callback - to be called after the initialization is done
 */
const start = (callback = _ => {}) => {
    // TODO: check if the 'mail' parameters are set
    transport = nodemailer.createTransport(options, defaults);

    // TODO: handle error
    // verify connection configuration
    transport.verify(callback);
};

const notifyTeachers = async () => {
    const scheduledLectures = await require('../services/lectureService').getNextDayLectures();
    scheduledLectures.forEach(lecture => {
        send({
            to: lecture.teacher.email,
            subject: __subject(lecture),
            text: __text(lecture),
        }, () => console.log(`sent email to ${lecture.teacher.email}`));
    });
};

/**
 * Requires a cron job (see {@link https://github.com/node-cron/node-cron|node-cron on Github}) to be
 * executed at a specific time
 * @param {string} [expression] - properly formatted string that represent the periodicity of the job.
 *                                  Default: every day at 11 p.m.
 * @returns {function} - update function
 */
const job = (expression = '* * 23 * * Sun-Thu') => {
    const cron = require('node-cron');
    if (!cron.validate(expression))
        throw new Error("Invalid node-cron expression");

    return cron.schedule(expression, notifyTeachers, { scheduled: false, timezone: "Europe/Rome" });
};

const __subject = (lecture) => `[${lecture.course.code}] ${lecture.date} lecture recap`;
const __text = (lecture) => `
    Dear ${lecture.teacher.name} ${lecture.teacher.surname},
    
    there are ${lecture.bookings} students booked for the "${lecture.course.name} - ${lecture.course.code}" lecture scheduled in date ${lecture.date} in room "${lecture.room}".
    
    Regards.
    
    -----
    
    This is an automatic email, please don't answer
    PULSeBS, 2020
`;

/**
 * Send an email to a list of recipients
 * @param {string} to - list of recipients
 * @param {string} subject - subject of the email
 * @param {string} text - body of the email
 * @param {function} callback - is executed after the email is sent
 * @returns {Promise<any>}
 */
const send = async ({to, subject, text}, callback = _=>{}) => {
    const message = {to, subject, text};
    return transport.sendMail(message, callback());
};

module.exports = { start, job, send };
