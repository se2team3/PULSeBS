const studentDao  = require('../daos/student_dao');
const errHandler = require('./errorHandler');


const restrictedData = async () => {
    return {
        name: "private",
        surname: "you can't see if not student"
    };
};

const getStudentLecture = async function(student_id) {
    try {
        let lectures = await studentDao.retrieveStudentLecture(student_id);
        return lectures;
    } catch (error) {
        return errHandler(error);
    }
}



module.exports = { restrictedData,getStudentLecture };
