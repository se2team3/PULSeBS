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

// BOOKING CONFIRMATION
const studentBookingBody = (user, lecture) =>
    `
    Dear ${user.name} ${user.surname},
    
    You have correctly booked the lesson of "${lecture.course_name}". The lecture is scheduled in date ${lecture.datetime} in room "${lecture.room_name}".
    
    Regards.
    
    -----
    
    This is an automatic email, please don't answer
    PULSeBS, 2020`
;


// BOOKING CONFIRMATION after POPPING
const studentPoppingBody = (user, lecture) =>
  `
    Dear ${user.name} ${user.surname},
    
    Someone has canceled their booking for the lesson of "${lecture.course_name}" scheduled in date ${lecture.datetime} in room "${lecture.room_name}".

    You can now attend the lecture in presence.

    Regards.
    
    -----
    
    This is an automatic email, please don't answer
    PULSeBS, 2020`
;


// STUDENT IN WAITING LIST
const studentWaitingBody = (user, lecture) =>
  `
    Dear ${user.name} ${user.surname},
    
    The lesson of "${lecture.course_name}" scheduled in date ${lecture.datetime} in room "${lecture.room_name}" has reached the maximum number of bookings.

    You are currently in the waiting list and you'll be notified if you can attend the lecture.

    Regards.
    
    -----
    
    This is an automatic email, please don't answer
    PULSeBS, 2020`
;

const studentBookingSubject = (lecture) => `[${lecture.course_name}] ${lecture.datetime} booking confirmation`;
const studentPoppedSubject = (lecture) => `[${lecture.course_name}] ${lecture.datetime} booking update`;
const studentWaitingSubject = (lecture) => `[${lecture.course_name}] ${lecture.datetime} booking confirmation - Waiting`;

// LECTURE CANCELLED
const studentCancelledLectureBody = (user, lecture) =>
    `
    Dear ${user.name} ${user.surname},
    
    We inform you that the lecture "${lecture.course_name}", scheduled in date ${lecture.datetime}, in room "${lecture.room_name}" has been cancelled.

    Regards.
    
    -----
    
    This is an automatic email, please don't answer
    PULSeBS, 2020`
;

const studentCancelledLectureSubject = (lecture) => `[${lecture.course_name}] ${lecture.datetime} lecture cancelled`;

module.exports = {
    teacherLectureRecapBody, studentBookingBody, studentPoppingBody, studentWaitingBody, studentCancelledLectureBody,
    studentBookingSubject, studentPoppedSubject, studentWaitingSubject, teacherLectureRecapSubject, studentCancelledLectureSubject
}
