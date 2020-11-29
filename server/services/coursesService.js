const coursesDao = require('../daos/course_dao');
const lectureDao = require('../daos/lecture_dao')
const errHandler = require('./errorHandler');

exports.createCoursesTable = async function() {    
    try{
        return coursesDao.createCourseTable();
    }catch(err){
        return errHandler(err);
    }
}

exports.addCourse = async function(course) {
    try {
        let id = await coursesDao.insertCourse({...course});
        return id;
    } catch (error) {
        return errHandler(error);
    }
}

exports.getCourse = async function(course_id) {
    try {
        let course = await coursesDao.retrieveCourse(course_id);
        return course;
    } catch (error) {
        return errHandler(error);
    }
}

exports.deleteCourses = async function(){
    try {
        return coursesDao.deleteCourseTable();
    } catch (error) {
        return errHandler(error);
    }
} 
exports.getLectures = async function(course_id){
    console.log(course_id)
    try{
        return lectureDao.getLectures(course_id);
    } catch(error){
        return errHandler(error);
    }
}