const extendedLectureDao = require('../daos/extended_lecture_dao');
const errHandler = require('./errorHandler');


exports.getLectureById = async function(lecture_id) {
    try {
        let lecture = await extendedLectureDao.retrieveLecture(lecture_id);
        return lecture;
    } catch (error) {
        return errHandler(error);
    }
}