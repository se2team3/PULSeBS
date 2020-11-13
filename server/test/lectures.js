process.env.NODE_ENV = 'test';
require('dotenv').config({ path: './config/config.env' });

const moment = require('moment');
const dbUtils = require('../utils/db');
const lectureDao = require('../daos/lecture_dao');
const userDao = require('../daos/user_dao');
const roomDao = require('../daos/room_dao');
const courseDao = require('../daos/course_dao');
const bookingDao = require('../daos/booking_dao');
const lectureServices = require('../services/lectures');

const chai = require('chai');
const should = chai.should();

const populate = async ({datetime = moment().add(1,'days').format('YYYY-MM-DD')}) => {
    const counter = require('../utils/counter')();
    await userDao.insertUser(dbUtils.teacherObj(counter.get()));
    await roomDao.insertRoom({name: 'Aula 1', seats: 200});
    await courseDao.insertCourse({code: 'SE2', name: 'Software Engineering 2', teacher_id: 1});
    // TODO check date format
    await lectureDao.insertLecture({
        datetime,
        course_id: 1,
        room_id: 1
    });
    for (let i = 2; i < 52; i++) {
        await userDao.insertUser(dbUtils.studentObj(counter.get()));
        await bookingDao.insertBooking({ lecture_id: 1, student_id: i });
    }
};

describe('Lecture testing', function() {
    beforeEach('clean db', async function() {
        await dbUtils.reset();
    });

    describe('Lecture services', async function() {
        it('should retrieve the list of tomorrow lectures', async function() {
            // populate db
            await populate({});
            const res = await lectureServices.getNextDayLectures();
            should.exist(res);
            res.should.be.an('array').that.has.length(1);
            res.should.be.eql([{
                    teacher: { name: 'Micheal', surname: 'Jordan', email: 'email@host.com' },
                    course: { name: 'Software Engineering 2', code: 'SE2' },
                    date: '2020-11-14',
                    room: '1',
                    bookings: 50
                }]
            );
        });

        it('should retrieve an empty list for Sundays lecture', async function() {
            // populate db
            await populate({});
            const daysToSunday = +moment().startOf('isoWeek').add(1, 'week').fromNow('day').split(" ")[0];
            const res = await lectureServices.getNextDayLectures(daysToSunday);
            should.exist(res);
            res.should.be.an('array').that.has.length(0);
        });
    });
});