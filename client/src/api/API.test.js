import API from "./API";
import moment from 'moment'
var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

const sample_lectures = [
    {
        id: 0,
        datetime: "2013-10-07 04:23:19.120-04:00",
        course_id: 42,
        room_id: null,
        virtual: true,
        deleted_at: null
    },
    {
        id: 1,
        datetime: "2013-10-07 04:23:19.120-04:00",
        course_id: 42,
        room_id: 5,
        virtual: false,
        deleted_at: null
    },
    {
        id: 2,
        datetime: "2013-10-07 04:23:19.120-04:00",
        course_id: 42,
        room_id: 5,
        virtual: false,
        deleted_at: null
    }
]

const sample_lecture = {
    id: 42,
    datetime: "2013-10-07 04:23:19.120-04:00",
    course_id: 4,
    room_id: 5,
    virtual: false,
    deleted_at: null
}

describe('getLectures, client API calls', () => {

    beforeEach(() => {
        mock.reset()
    });

    it('returns all the lectures in the db', async () => {
        mock.onGet("/lectures").reply(200, sample_lectures);
        const lectures = await API.getLectures();
        expect(lectures[0].id).toEqual(sample_lectures[0].id);
        expect(lectures[0].datetime).toEqual(sample_lectures[0].datetime); //TODO do more reasonable tests
        expect(lectures[1].id).toEqual(sample_lectures[1].id);
        expect(lectures[2].id).toEqual(sample_lectures[2].id);
    });

    it('returns all the lectures in a given time frame', async () => {
        mock.onGet("/lectures", {params: {from: moment("2013-10-07 04:23:19.120-04:00").unix(), to: moment("2013-10-07 04:23:19.120-04:00").unix()}}).reply(200, sample_lectures);
        const lectures = await API.getLectures("2013-10-07 04:23:19.120-04:00", "2013-10-07 04:23:19.120-04:00");
        expect(lectures[0].id).toEqual(sample_lectures[0].id);
        expect(lectures[0].datetime).toEqual(sample_lectures[0].datetime); //TODO do more reasonable tests
        expect(lectures[1].id).toEqual(sample_lectures[1].id);
        expect(lectures[2].id).toEqual(sample_lectures[2].id);
    });

    it('returns all the lectures in the db but there is no lecture', async () => {
        mock.onGet("/lectures").reply(200, []);
        const lectures = await API.getLectures();
        expect(lectures.length).toEqual(0);
    });

    it('returns all the lectures in the db but something went wrong', async () => {
        mock.onGet("/lectures").reply(500, "internal server error");
        try{
            await API.getLectures();
        }
        catch(e){
            expect(e.status).toBe(500);
        }
        
    });
})

describe('getLecture, client API calls', () => {

    beforeEach(() => {
        mock.reset()
    });

    it('returns a lecture given its id', async () => {
        mock.onGet("/lecture/42").reply(200, sample_lecture);
        const lecture = await API.getLecture(42);
        expect(lecture.id).toEqual(sample_lecture.id);
    });

    it('lecture does not exist', async () => {
        mock.onGet("/lecture/999").reply(404, "Lecture not found");
        try{
            await API.getLecture(999);
        }
        catch(e){
            expect(e.status).toBe(404);
        }
    });

    it('something went wrong getting lecture', async () => {
        mock.onGet("/lecture/12").reply(500, "internal server error");
        try{
            await API.getLecture(12);
        }
        catch(e){
            expect(e.status).toBe(500);
        }
        
    });
})