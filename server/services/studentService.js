const studentDao  = require('../daos/student_dao');
const errHandler = require('./errorHandler');

const getStudentLecture = async function(student_id) {
    try {
        const lectures = await studentDao.retrieveStudentLectures(student_id);
        return lectures;
    } catch (error) {
        return errHandler(error);
    }
}

module.exports = { getStudentLecture };
