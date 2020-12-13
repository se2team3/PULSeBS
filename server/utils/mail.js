const { mail } = require('../config/config');
const nodemailer = require('nodemailer');
const userService = require("../services/userService")
const bookingDao = require("../daos/booking_dao")
const lectureDao = require("../daos/lecture_dao")
const extendedLectureService = require("../services/extendedLectureService")
const mailFormatter = require('./mailFormatter');

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
const start = (callback = _ => { }) => {
    // TODO: check if the 'mail' parameters are set
    transport = nodemailer.createTransport(options, defaults);

    // TODO: handle error
    // verify connection configuration
    transport.verify(callback);
};

const notifyBooking = async (booking) => {

    if (!booking) return new Promise((resolve, reject) => {reject("Undefined recipient")});
    
    const user = await userService.getUser(booking.student_id);
    const lecture = await extendedLectureService.getLectureById(booking.lecture_id);
    const txt = mailFormatter.studentBookingBody(user,lecture);
    const info = await send({
        to: user.email,
        subject: mailFormatter.studentBookingSubject(lecture),
        text: txt,
    });

    return {info,txt};
};




const notifyTeachers = async () => {
    const scheduledLectures = await lectureDao.retrieveNextDayLectures(2);
    scheduledLectures.forEach(lecture => {
        console.log(`email`, lecture);
        send({
            to: lecture.teacher.email,
            subject: mailFormatter.teacherLectureRecapSubject(lecture),
            text: mailFormatter.teacherLectureRecapBody(lecture),
        }, () => console.log(`sent email to ${lecture.teacher.email}`));
    });
};

const notifyLectureCancellation = async (lecture) => {

    // create query to get all booked students for a lecture
    try {
        let existingLecture = await extendedLectureService.getLectureById(lecture.lecture_id).catch(()=>{throw Error('Invalid lecture!')});

        let bookedStudents = await bookingDao.retrieveListOfBookedStudents(lecture.lecture_id);
        let successfulMails = [];
        let promises = Promise.all(bookedStudents.map((student) => {
            let mailText = mailFormatter.studentCancelledLectureBody(student, existingLecture);
            let mailSubject = mailFormatter.studentCancelledLectureSubject(existingLecture);
            send({
                to: student.email,
                subject: mailSubject,
                text: mailText,
            }, () => successfulMails.push({to: student.email, text: mailText}));
        }));
        await promises;
        return successfulMails;
    } catch (error) {
        return error;
    }

};

/**
 * Requires a cron job (see {@link https://github.com/node-cron/node-cron|node-cron on Github}) to be
 * executed at a specific time
 * @param {string} [expression] - properly formatted string that represent the periodicity of the job.
 *                                  Default: every day at 11 p.m.
 * @returns {function} - update function
 */
const job = (expression = '00 23 * * Sun-Thu') => {
    const cron = require('node-cron');
    if (!cron.validate(expression))
        throw new Error("Invalid node-cron expression");

    return cron.schedule(expression, notifyTeachers, { scheduled: false, timezone: "Europe/Rome" });
};


/**
 * Send an email to a list of recipients
 * @param {string} to - list of recipients
 * @param {string} subject - subject of the email
 * @param {string} text - body of the email
 * @param {function} callback - is executed after the email is sent
 * @returns {Promise<any>}
 */
const send = async ({ to, subject, text }, callback = _ => { }) => {
    const message = { to, subject, text };
    return transport.sendMail(message, callback());
};

module.exports = { start, job, send, notifyBooking, notifyLectureCancellation };
