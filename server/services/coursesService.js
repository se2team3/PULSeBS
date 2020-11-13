const coursesDao = require('../daos/course_dao');
const errHandler = require('./errorHandler');

exports.createCoursesTable = async function() {    
    try{
        await coursesDao.createCourseTable();
    }catch(err){
        return errHandler(err);
    }
}

exports.addCourse = async function(code,name,teacher_id) {
    try {
        let id = await coursesDao.insertCourse(code,name,teacher_id);
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