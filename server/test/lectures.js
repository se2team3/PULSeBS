process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });

const moment = require('moment');
const dbUtils = require('../utils/db');
const lectureServices = require('../services/lectures');

const chai = require('chai');
const should = chai.should();

describe('Lecture testing', function() {
    before('create tables and clear db', async function() {
        await dbUtils.reset();
    });

    beforeEach('clear db', async function() {
        await dbUtils.reset({ create: false });
    });

    after('clear db', async function() {
        await dbUtils.reset({ create: false });
    });

    describe('Lecture services', async function() {
        it('should retrieve the list of tomorrow lectures', async function() {
            const tomorrow = moment().add(1,'days').format('YYYY-MM-DD');
            const data = await dbUtils.populate({ n_students: 50, datetime: tomorrow });
            const res = await lectureServices.getNextDayLectures();
            should.exist(res);
            res.should.be.an('array').that.has.length(1);
            res.should.be.eql([{
                    teacher: { name: 'Micheal', surname: 'Jordan', email: 'email@host.com' },
                    course: { name: 'Software Engineering 2', code: 'SE2' },
                    date: tomorrow,
                    room: data.lecture.room_id,
                    bookings: 50
                }]
            );

            const response = {
                teacher: { email: data.teacher.email, name: data.teacher.name, surname: data.teacher.surname },
                course: { code: data.course.code, name: data.course.name },
                date: data.lecture.datetime,
                room: data.room_id,
                bookings: data.booked
            };
            res.should.be.eql([response]);
        });

        it('should retrieve an empty list for Sundays lecture', async function() {
            // populate db
            await dbUtils.populate();
            const daysToSunday = +moment().startOf('isoWeek').add(1, 'week').fromNow('day').split(" ")[0];
            const res = await lectureServices.getNextDayLectures(daysToSunday);
            should.exist(res);
            res.should.be.an('array').that.has.length(0);
        });
    });
});