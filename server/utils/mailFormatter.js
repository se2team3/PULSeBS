/**
 * TEACHER emails functions
 */
const teacherLectureRecapBody = (lecture) => `
    Dear ${lecture.teacher.name} ${lecture.teacher.surname},
    
    there are ${lecture.bookings} students booked for the "${lecture.course.name} - ${lecture.course.code}" lecture scheduled in date ${lecture.date} in room "${lecture.room}".
    
    Regards.
    
    -----
    
    This is an automatic email, please don't answer
    PULSeBS, 2020`
    ;

const teacherLectureRecapSubject = (lecture) => `[${lecture.course.code}] ${lecture.date} lecture recap`;
/**
 * STUDENT email functions
 */
const studentBookingBody = (user, lecture) =>
    `
    Dear ${user.name} ${user.surname},
    
    You have correctly booked the lesson of "${lecture.course_name}". The lecture is scheduled in date ${lecture.datetime} in room "${lecture.room_name}".

    Regards.
    
    -----
    
    This is an automatic email, please don't answer
    PULSeBS, 2020`
;

const studentBookingSubject = (lecture) => `[${lecture.course_name}] ${lecture.datetime} booking confirmation`;

module.exports = {teacherLectureRecapBody, studentBookingBody, studentBookingSubject, teacherLectureRecapSubject}