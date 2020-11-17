import API from "./API";
import moment from 'moment';
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

const base_url = '/api'

const sample_lectures = [
    {
        id: 0,
        datetime: "2013-10-07 04:23:19.120-04:00",
        course_id: 42,
        room_id: null,
        virtual: true,
        deleted_at: null,
        datetime_end: "2013-10-07 04:23:19.120-04:00",
        course_name:"Physics",
        teacher_name:"Mario",
        teacher_surname: "Rossi",
        room_name:"1B",
        max_seats:35,
        booking_counter:30
    },
    {
        id: 1,
        datetime: "2013-10-07 04:23:19.120-04:00",
        course_id: 42,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2013-10-07 04:23:19.120-04:00",
        course_name:"Physics",
        teacher_name:"Mario",
        teacher_surname: "Rossi",
        room_name:"1B",
        max_seats:35,
        booking_counter:30
    },
    {
        id: 2,
        datetime: "2013-10-07 04:23:19.120-04:00",
        course_id: 42,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2013-10-07 04:23:19.120-04:00",
        course_name:"Physics",
        teacher_name:"Mario",
        teacher_surname: "Rossi",
        room_name:"1B",
        max_seats:35,
        booking_counter:30
    }
]

const sample_lecture = {
    id: 42,
    datetime: "2013-10-07 04:23:19.120-04:00",
    course_id: 4,
    room_id: 5,
    virtual: false,
    deleted_at: null,
    datetime_end: "2013-10-07 04:23:19.120-04:00",
    course_name:"Physics",
    teacher_name:"Mario",
    teacher_surname: "Rossi",
    room_name:"1B",
    max_seats:35,
    booking_counter:30
}

const sample_bookings = [
    {
        lecture_id: 42,
        student_id: 1,
        waiting: false,
        present: false,
        updated_at: "2013-10-07 04:23:19.120-04:00",
        deleted_at: null
    },
    {
        lecture_id: 42,
        student_id: 2,
        waiting: false,
        present: false,
        updated_at: "2013-10-07 04:23:19.120-04:00",
        deleted_at: null
    },
    {
        lecture_id: 42,
        student_id: 3,
        waiting: true,
        present: false,
        updated_at: "2013-10-07 04:23:19.120-04:00",
        deleted_at: null
    }
]

const sample_booking = {
    lecture_id: 42,
    student_id: 2,
    waiting: false,
    present: false,
    updated_at: "2013-10-07 04:23:19.120-04:00",
    deleted_at: null
};


describe('Client API calls', () => {
    describe('getLectures', () => {

        beforeEach(() => {
            mock.reset()
        });

        it('returns all the lectures in the db', async () => {
            mock.onGet(base_url+"/lectures").reply(200, sample_lectures);
            const lectures = await API.getLectures();
            expect(lectures[0].id).toEqual(sample_lectures[0].id);
            expect(lectures[0].datetime).toEqual(sample_lectures[0].datetime); //TODO do more reasonable tests
            expect(lectures[1].id).toEqual(sample_lectures[1].id);
            expect(lectures[2].id).toEqual(sample_lectures[2].id);
        });

        it('returns all the lectures in a given time frame', async () => {
            mock.onGet(base_url+"/lectures", { params: { from: "2013-10-07", to: "2013-10-07" } }).reply(200, sample_lectures);
            const lectures = await API.getLectures("2013-10-07", "2013-10-07");
            expect(lectures[0].id).toEqual(sample_lectures[0].id);
            expect(lectures[0].datetime).toEqual(sample_lectures[0].datetime); //TODO do more reasonable tests
            expect(lectures[1].id).toEqual(sample_lectures[1].id);
            expect(lectures[2].id).toEqual(sample_lectures[2].id);
        });

        it('returns all the lectures in the db but there is no lecture', async () => {
            mock.onGet(base_url+"/lectures").reply(200, []);
            const lectures = await API.getLectures();
            expect(lectures.length).toEqual(0);
        });

        it('returns all the lectures in the db but something went wrong', async () => {
            mock.onGet(base_url+"/lectures").reply(500, "internal server error");
            try {
                await API.getLectures();
            }
            catch (e) {
                expect(e.status).toBe(500);
            }
        });
    })

    describe('getLecture', () => {

        beforeEach(() => {
            mock.reset()
        });

        it('returns a lecture given its id', async () => {
            mock.onGet(base_url+"/lectures/42").reply(200, sample_lecture);
            const lecture = await API.getLecture(42);
            expect(lecture.id).toEqual(sample_lecture.id);
        });

        it('lecture does not exist', async () => {
            mock.onGet(base_url+"/lectures/999").reply(404, "Lecture not found");
            try {
                await API.getLecture(999);
            }
            catch (e) {
                expect(e.status).toBe(404);
            }
        });

        it('something went wrong getting lecture', async () => {
            mock.onGet(base_url+"/lectures/12").reply(500, "internal server error");
            try {
                await API.getLecture(12);
            }
            catch (e) {
                expect(e.status).toBe(500);
            }
        });
    })

    describe('getBookings', () => {

        beforeEach(() => {
            mock.reset()
        });

        it('returns all the bookings for a lecture', async () => {
            mock.onGet(base_url+"/lectures/42/bookings").reply(200, sample_bookings);
            const bookings = await API.getBookings(42);
            expect(bookings[0].lecture_id).toEqual(sample_bookings[0].lecture_id);
            expect(bookings[0].student_id).toEqual(sample_bookings[0].student_id);
            expect(bookings[0].updated_at).toEqual(sample_bookings[0].updated_at); //TODO do more reasonable tests
            expect(bookings[1].lecture_id).toEqual(sample_bookings[1].lecture_id);
            expect(bookings[1].student_id).toEqual(sample_bookings[1].student_id);
            expect(bookings[1].updated_at).toEqual(sample_bookings[1].updated_at); //TODO do more reasonable tests
        });

        it('no bookings are present for this lecture', async () => {
            mock.onGet(base_url+"/lectures/43/bookings").reply(200, []);
            const bookings = await API.getBookings(43);
            expect(bookings.length).toEqual(0);
        });

        it('something went wrong getting bookings', async () => {
            mock.onGet(base_url+"/lectures/44/bookings").reply(500, "internal server error");
            try {
                await API.getBookings(44);
            }
            catch (e) {
                expect(e.status).toBe(500);
            }
        });
    })

    describe('bookLecture', () => {
        beforeEach(() => {
            mock.reset()
        });

        it('returns all the bookings for a lecture', async () => {
            mock.onPost(base_url+`/students/${sample_booking.student_id}/bookings`,{lecture_id: sample_booking.lecture_id}).reply(200, sample_booking);
            const booking = await API.bookLecture(sample_booking.student_id, sample_booking.lecture_id);
            expect(booking.lecture_id).toEqual(sample_booking.lecture_id);
            expect(booking.student_id).toEqual(sample_booking.student_id);
            expect(booking.updated_at).toEqual(sample_booking.updated_at); //TODO do more reasonable tests
        });

        it('something went wrong getting bookings', async () => {
            mock.onPost(base_url+`/students/${sample_booking.student_id}/bookings`).reply(500, "internal server error");
            try {
                await API.bookLecture(sample_booking.student_id, sample_booking.lecture_id);
            }
            catch (e) {
                expect(e.status).toBe(500);
            }
        });
    })
})