const extendedLectureDao = require('../daos/extended_lecture_dao');
const errHandler = require('./errorHandler');


exports.getLectureById = async function(lecture_id) {
    try {
        let lecture = await extendedLectureDao.getLectureById(lecture_id);
        return lecture;
    } catch (error) {
        return errHandler(error);
    }
}

/*exports.getLecturesByTeacherId = async function(teacher_id, from, to) {
    try {
        return await extendedLectureDao.getLecturesByTeacherId(teacher_id, from, to);
    } catch (error) {
        return errHandler(error);
    }
}*/
exports.getAllLectures = async function(start_date,end_date) {
    try {
        let lecture = await extendedLectureDao.getAllLectures(start_date,end_date);
        return lecture;
    } catch (error) {
        return errHandler(error);
    }
}