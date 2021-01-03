import API from "./";
import setupAPI from "./setupAPI";
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

const sample_booking_waiting = {
    lecture_id: 42,
    student_id: 2,
    waiting: true,
    present: false,
    updated_at: "2013-10-07 04:23:19.120-04:00",
    deleted_at: null
};

const sample_user={
    university_id:1,
    email: 'email@host.com',
    password: 'passw0rd',
    name: 'Micheal',
    surname: 'Jordan',
    role: 'teacher'

}

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

        it('book a lecture', async () => {
            mock.onPost(base_url+`/students/${sample_booking.student_id}/bookings`,{lecture_id: sample_booking.lecture_id}).reply(201, sample_booking);
            const booking = await API.bookLecture(sample_booking.student_id, sample_booking.lecture_id);
            expect(booking.lecture_id).toEqual(sample_booking.lecture_id);
            expect(booking.student_id).toEqual(sample_booking.student_id);
            expect(booking.updated_at).toEqual(sample_booking.updated_at); //TODO do more reasonable tests
        });

        it('book a lecture but you are put in the waiting list', async () => {
            mock.onPost(base_url+`/students/${sample_booking_waiting.student_id}/bookings`,{lecture_id: sample_booking_waiting.lecture_id}).reply(201, sample_booking_waiting);
            const booking = await API.bookLecture(sample_booking_waiting.student_id, sample_booking_waiting.lecture_id);
            expect(booking.lecture_id).toEqual(sample_booking_waiting.lecture_id);
            expect(booking.student_id).toEqual(sample_booking_waiting.student_id);
            expect(booking.waiting).toEqual(sample_booking_waiting.waiting);
            expect(booking.updated_at).toEqual(sample_booking_waiting.updated_at); //TODO do more reasonable tests
        });

        it('something went wrong booking lecture', async () => {
            mock.onPost(base_url+`/students/${sample_booking.student_id}/bookings`).reply(500, "internal server error");
            try {
                await API.bookLecture(sample_booking.student_id, sample_booking.lecture_id);
            }
            catch (e) {
                expect(e.status).toBe(500);
            }
        });
    })

    describe('cancelBooking', () => {
        beforeEach(() => {
            mock.reset()
        });

        it('cancel a booked lecture', async () => {
            mock.onDelete(base_url+`/students/${sample_booking.student_id}/lectures/${sample_booking.lecture_id}`).reply(200,{});
            const hasBeenDeleted = await API.cancelBooking(sample_booking.student_id, sample_booking.lecture_id);
            expect(hasBeenDeleted).toBe(true);
        });

        it('something went wrong cancelling booked lecture', async () => {
            mock.onDelete(base_url+`/students/${sample_booking.student_id}/lectures/${sample_booking.lecture_id}`).reply(500, "internal server error");
            try {
                await API.cancelBooking(sample_booking.student_id, sample_booking.lecture_id);
            }
            catch (e) {
                expect(e.status).toBe(500);
            }
        });
    })

    describe('cancelLecture', () => {
        beforeEach(() => {
            mock.reset()
        });

        it('cancel a lecture', async () => {
            mock.onDelete(base_url+`/lectures/${sample_lecture.id}`).reply(200,{});
            const hasBeenDeleted = await API.cancelLecture(sample_booking.lecture_id);
            expect(hasBeenDeleted).toBe(true);
        });

        it('something went wrong cancelling lecture', async () => {
            mock.onDelete(base_url+`/lectures/${sample_booking.lecture_id}`).reply(500, "internal server error");
            try {
                await API.cancelLecture(sample_booking.lecture_id);
            }
            catch (e) {
                expect(e.status).toBe(500);
            }
        });
    })

    describe('patchLecture', () => {
        beforeEach(() => {
            mock.reset()
        });

        it('patch a lecture to change it to a remote lecture', async () => {
            mock.onPatch(base_url+`/lectures/${sample_lecture.id}`,{virtual: true}).reply(200,{});
            const hasBeenChanged = await API.patchLecture(sample_booking.lecture_id, {virtual:true});
            expect(hasBeenChanged).toBe(true);
        });

        it("The lecture doesn't exist or it has already been set", async () => {
            mock.onPatch(base_url+`/lectures/${sample_lecture.id}`,{virtual: true}).reply(304, "internal server error");
            try {
                await API.patchLecture(sample_booking.lecture_id, {virtual:true});
            }
            catch (e) {
                expect(e.status).toBe(304);
            }
        });

        it('Invalid status value', async () => {
            mock.onPatch(base_url+`/lectures/${sample_lecture.id}`,{virtual: true}).reply(400, "internal server error");
            try {
                await API.patchLecture(sample_booking.lecture_id, {virtual:true});
            }
            catch (e) {
                expect(e.status).toBe(400);
            }
        });

        it('something went wrong changing to remote lecture', async () => {
            mock.onPatch(base_url+`/lectures/${sample_lecture.id}`,{virtual: true}).reply(500, "internal server error");
            try {
                await API.patchLecture(sample_booking.lecture_id, {virtual:true});
            }
            catch (e) {
                expect(e.status).toBe(500);
            }
        });
    })

    describe('setup', () => {
        beforeEach(() => {
            mock.reset()
        });

        it('returns true on 201', async () => {
            mock.onPost(base_url+`/setup`,{students: [], teachers: [], courses: [], enrollment: [], schedule: []}).reply(201, "");
            const success = await setupAPI.setup([],[],[],[],[]);
            expect(success).toBe(true);
        });

        it("The lecture doesn't exist or it has already been set", async () => {
            mock.onPost(base_url+`/setup`,{students: [], teachers: [], courses: [], enrollment: [], schedule: []}).reply(304, "internal server error");
            try {
                await setupAPI.setup([],[],[],[],[]);
            }
            catch (e) {
                expect(e.status).toBe(304);
            }
        });

        it('Invalid status value', async () => {
            mock.onPost(base_url+`/setup`,{students: [], teachers: [], courses: [], enrollment: [], schedule: []}).reply(400, "internal server error");
            try {
                await setupAPI.setup([],[],[],[],[]);
            }
            catch (e) {
                expect(e.status).toBe(400);
            }
        });

        it('something went wrong changing to remote lecture', async () => {
            mock.onPost(base_url+`/setup`,{students: [], teachers: [], courses: [], enrollment: [], schedule: []}).reply(500, "internal server error");
            try {
                await setupAPI.setup([],[],[],[],[]);
            }
            catch (e) {
                expect(e.status).toBe(500);
            }
        });
    })

    describe('getStudentLectures', () => {
        beforeEach(() => {
            mock.reset();
        });

       // const from = "2013-10-07", to = "2013-10-07", unused = undefined;

        it('returns all the student lectures in the db', async () => {
            mock.onGet(base_url+"/students/1/lectures").reply(200, sample_lectures);
            const studentLectures = await API.getLectures(unused, unused, 'student', 1);
            for (let i = 0; i < sample_lectures.length; i++)
                expect({deleted_at: null, ...studentLectures[i]}).toMatchObject(sample_lectures[i]);

        });
    });

    describe('getManagerLectures', () => {
        beforeEach(() => {
            mock.reset();
        });


        it('returns all the student lectures in the db', async () => {
            mock.onGet(base_url+"/lectures").reply(200, sample_lectures);
            const studentLectures = await API.getLectures(unused, unused, 'manager', 1);
            for (let i = 0; i < sample_lectures.length; i++)
                expect({deleted_at: null, ...studentLectures[i]}).toMatchObject(sample_lectures[i]);

        });
    });

    describe('getInvalidRoleLectures', () => {
        beforeEach(() => {
            mock.reset();
        });

        it('should not return anything', async () => {
            try{
                const studentLectures = await API.getLectures(unused, unused, 'abc', 1);
            }
            catch(e){expect(e.message).toBe('Invalid role!')}
        });
    });

    describe('getTeacherLectures', () => {
        beforeEach(() => {
            mock.reset();
        });

        const from = "2013-10-07", to = "2013-10-07", unused = undefined;

        it('returns all the teacher lectures in the db', async () => {
            mock.onGet(base_url+"/teachers/1/lectures").reply(200, sample_lectures);
            const teacherLectures = await API.getLectures(unused, unused, "teacher", 1);
            for (let i = 0; i < sample_lectures.length; i++)
                expect({deleted_at: null, ...teacherLectures[i]}).toMatchObject(sample_lectures[i]);
        });

        it('returns all the teacher lectures in a given time frame', async () => {
            mock.onGet(base_url+"/teachers/1/lectures", { params: { from, to } })
              .reply(200, sample_lectures);
            const teacherLectures = await API.getLectures(from, to, "teacher", 1);
            for (let i = 0; i < sample_lectures.length; i++)
                expect({deleted_at: null, ...teacherLectures[i]}).toMatchObject(sample_lectures[i]);
        });

        it('returns all the teacher lectures in the db but there is no lecture', async () => {
            mock.onGet(base_url+"/teachers/1/lectures").reply(200, []);
            const teacherLectures = await API.getLectures(unused, unused, "teacher", 1);
            expect(teacherLectures.length).toEqual(0);
        });

        it('returns no teacher lectures in a given time frame', async () => {
            mock.onGet(base_url+"/teachers/1/lectures", { params: { from, to } })
              .reply(200, []);
            const teacherLectures = await API.getLectures(from, to, "teacher", 1);
            expect(teacherLectures.length).toEqual(0);
        });

        it('returns all the lectures in the db but something went wrong', async () => {
            mock.onGet(base_url+"/teachers/1/lectures").reply(500, "internal server error");
            try {
                await API.getLectures(unused, unused, "teacher", 1);
            }
            catch (e) {
                expect(e.status).toBe(500);
            }
        });
    })

    describe('getBookingManagerLectures', () => {
        beforeEach(() => {
            mock.reset()
        });

        const from = "2013-10-07", to = "2013-10-07", unused = undefined;

        it('returns all the lectures in the db', async () => {
            mock.onGet(base_url+"/lectures").reply(200, sample_lectures);
            const teacherLectures = await API.getLectures(unused, unused, "manager", unused);
            for (let i = 0; i < sample_lectures.length; i++)
                expect({deleted_at: null, ...teacherLectures[i]}).toMatchObject(sample_lectures[i]);
        });

        it('returns all the lectures in a given time frame', async () => {
            mock.onGet(base_url+"/lectures", { params: { from, to } })
              .reply(200, sample_lectures);
            const teacherLectures = await API.getLectures(from, to, "manager", unused);
            for (let i = 0; i < sample_lectures.length; i++)
                expect({deleted_at: null, ...teacherLectures[i]}).toMatchObject(sample_lectures[i]);
        });

        it('returns all the lectures in the db but there is no lecture', async () => {
            mock.onGet(base_url+"/lectures").reply(200, []);
            const teacherLectures = await API.getLectures(unused, unused, "manager", unused);
            expect(teacherLectures.length).toEqual(0);
        });

        it('returns no lectures in a given time frame', async () => {
            mock.onGet(base_url+"/lectures", { params: { from, to } })
              .reply(200, []);
            const teacherLectures = await API.getLectures(from, to, "manager", unused);
            expect(teacherLectures.length).toEqual(0);
        });

        it('returns all the lectures in the db but something went wrong', async () => {
            mock.onGet(base_url+"/lectures").reply(500, "internal server error");
            try {
                await API.getLectures(unused, unused, "manager", unused);
            }
            catch (e) {
                expect(e.status).toBe(500);
            }
        });
    });

    /* describe('userAuthentication', () => {
        beforeEach(() => {
            mock.reset();
        });

        
        it('login', async () => {
            mock.onPost(base_url+`/login`,{email: sample_user.email, password:sample_user.password}).reply(201, sample_user);
            const user = await API.userLogin(sample_user.email, sample_user.password);
            expect(user.email).toEqual(sample_user.email);
            
        });
    }); */
})