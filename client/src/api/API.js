import Lecture from './models/lecture';

const baseURL = "";

/**
 * Get all lectures, optionally filter by time frame or use specific role and user
 * This is used to call:
 *  - GET /lectures
 *  - GET /lectures?from=<start_date>&to=<end_date>
 *  - GET /students/{student_id}/lectures
 *  - GET /students/{student_id}/lectures?from=<start_date>&to=<end_date>
 *  - GET /teachers/{student_id}/lectures
 *  - GET /teachers/{student_id}/lectures?from=<start_date>&to=<end_date>
 *  TODO: do we really need all these endpoints? The server should know already about the user and should be able to answer accordingly(?)
 *
 * @param {*} [start_date=undefined]
 * @param {*} [end_date=undefined]
 * @param {*} [role=undefined]
 * @param {*} [user_id=undefined]
 * @returns
 */
async function getLectures(start_date = undefined, end_date = undefined, role = undefined, user_id = undefined) {
    let url = "/lectures";
    if (role !== undefined && user_id !== undefined) {
        switch (role) {
            case "student":
                url = `/students/${user_id}/lectures`;
                break;
            case "teacher":
                url = `/teachers/${user_id}/lectures`
                break;
        }
    }

    if (start_date !== undefined || end_date !== undefined) {
        url += "?";
        if (start_date !== undefined)
            url += `from=${start_date}&`;
        if (end_date !== undefined)
            url += `to=${end_date}`;
    }

    const response = await fetch(baseURL + url);
    const lecturesJson = await response.json();
    if (response.ok) {
        return lecturesJson.map(
            (o) => new Lecture(o.id, o.datetime, o.course_id, o.room_id, o.virtual, o.deleted_at));
    } else {
        let err = { status: response.status, errObj: lecturesJson };
        throw err;  // An object with the error coming from the server
    }
}

const API = { getLectures }

export default API