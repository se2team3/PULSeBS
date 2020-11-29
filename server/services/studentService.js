const studentDao  = require('../daos/student_dao');
const errHandler = require('./errorHandler');

const getStudentLectures = async function(student_id,start_date, end_date) {
    try {
        let lectures;
        if(start_date&&end_date) lectures = await studentDao.retrieveStudentLecturesinTimeFrame(student_id,start_date, end_date);
        else lectures = await studentDao.retrieveStudentLectures(student_id);
        return lectures;
    } catch (error) {
        return errHandler(error);
    }
}

module.exports = { getStudentLectures };
