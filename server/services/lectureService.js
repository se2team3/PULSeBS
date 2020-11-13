const lectureDao = require('../daos/lecture_dao');
const errHandler = require('./errorHandler');

exports.createLecturesTable = async function() {    
    try{
        await lectureDao.createLectureTable();
    }catch(err){
        return errHandler(err);
    }
}

exports.addLecture = async function(datetime,course_id,room_id) {
    try {
        let id = await lectureDao.insertLecture(datetime,course_id,room_id);
        return id;
    } catch (error) {
        return errHandler(error);
    }
}

exports.getCourse = async function(lecture_id) {
    try {
        let lecture = await lectureDao.retrieveLecture(lecture_id);
        return lecture;
    } catch (error) {
        return errHandler(error);
    }
}