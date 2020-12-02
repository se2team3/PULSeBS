const lectureDao = require('../daos/lecture_dao');
const errHandler = require('./errorHandler');
const mailUtils = require("../utils/mail");

exports.createLecturesTable = function() {    
    try{
        return lectureDao.createLectureTable(); 
    }catch(err){
        return errHandler(err);
    }
}

exports.addLecture = async function(lecture) {
    try {
        let id = await lectureDao.insertLecture({...lecture});
        return id;
    } catch (error) {
        return errHandler(error);
    }
}

exports.deleteLecture = async function(lecture){
    try {
        let response= await lectureDao.deleteLecture({...lecture});
        mailUtils.notifyLectureCancellation({...lecture});

        return response;

    } catch (error) {
        return errHandler(error);
    }
}
exports.updateLectureVirtual = async function(lecture){
    try {
        let response= await lectureDao.setLectureVirtual({...lecture});
        return response;

    } catch (error) {
        return errHandler(error);
    }
}


exports.getLecture = async function(lecture_id) {
    try {
        let lecture = await lectureDao.retrieveLecture(lecture_id);
        return lecture;
    } catch (error) {
        return errHandler(error);
    }
}

exports.deleteLectures = async function(){
    try {
        return lectureDao.deleteLectureTable();
    } catch (error) {
        return errHandler(error);
    }
}

exports.getNextDayLectures = async (offset = 1) => await lectureDao.retrieveNextDayLectures({offset});
