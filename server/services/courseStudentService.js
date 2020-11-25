const courseStudentDao = require('../daos/course_student_dao');
const errHandler = require('./errorHandler');

exports.createCourseStudentTable = async function() {    
    try{
        await courseStudentDao.createCourse_StudentTable();
    }catch(err){
        return errHandler(err);
    }
}

exports.assingCourseToStudent = async function(course_id,student_id) {
    try {
        await courseStudentDao.assingCourseToStudent(course_id,student_id);
    } catch (error) {
        return errHandler(error);
    }
}

exports.getEnrolledStudents = async function(course_id) {
    try {
        let students = await courseStudentDao.retrieveEnrolledStudents(course_id);
        return students;
    } catch (error) {
        return errHandler(error);
    }
}

exports.getStudentCourses = async function(student_id) {
    try {
        let courses = await courseStudentDao.retrieveStudentCourses(student_id);
        return courses;
    } catch (error) {
        return errHandler(error);
    }
}