const extendedLectureDao = require('../daos/extended_lecture_dao');
const errHandler = require('./errorHandler');


exports.getLectureById = async function(lecture_id) {
    try {
        let lecture = await extendedLectureDao.getLectureById(lecture_id);
        console.log(lecture)
        return lecture;
    } catch (error) {
        return errHandler(error);
    }
}