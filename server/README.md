# API
<!-- Endpoints are meant to be preceded by /api (/operations == /api/operations)-->
## Bookings
- GET `/bookings`
  - Param: Time frame (start date and end date)
  - Response: List of all bookings
  ##### NOTE: This endpoint is intended to be used for statistics 

## Lectures
- GET `/lectures`
  - Param: NONE
  - Response: List of all lectures
- GET `/lectures?from=<start_date>&to=<end_date>`
  - Query: start_datem end_date
  - Response: List of all lectures in a given period
- GET `/lectures/{lecture_id}`
  - Param: lecture_id
  - Response: Lecture object for the given id
- GET `/lectures/{lecture_id}/bookings`
  - Param: lecture_id
  - Response: List of all bookings for a given lecture
- PATCH: `/lectures/{lecture_id}`
  - Param lecture_id
  - Body: {virtual: true/false}
  - Response: NONE
- POST: `/lectures`
  - Body: Lecture object (used to add a lecture)
  - Response: NONE
- DELETE: `/lectures/{lecture_id}`
  - Param: lecture_id
  - Response: NONE
  
## Courses
- GET `/courses`
  - Param: NONE
  - Response: List of all courses
- GET `/courses/{course_id}`
  - Param: course_id
  - Response: Course object
- GET `/courses/{course_id}/lectures`
  - Param: course_id
  - Response: List of all lectures for a given course
- GET `/courses/{course_id}/lectures?from=<start_date>&to=<end_date>`
  - Param: course_id
  - Response: List of all lectures for a given course in a certain time period
- POST `/courses`
  - Body: Course object
  - Response: Response status
  
## Students
- GET `/students/{student_id}/courses`
  - Param: student_id
  - Response: List of all courses the student is enrolled at
- GET `/students/{student_id}/bookings`
  - Param: student_id
  - Response: List of all the bookings for a given student
- GET `/students/{student_id}/lectures`
  - Param: student_id
  - Query: from (start_date), to (end_date)
  - Response: List of all lectures the student is entitled to follow
  ##### NOTE: This endpoint should receive query parameters for time frame
- DELETE `/students/{student_id}/lectures/{lecture_id}`
  - Param: student_id, lecture_id
  - Response: Response status
- POST `/students`
  - Body: Student opject
  - Response: Response status
- POST `/students/{student_id}/bookings`
  - Param: student_id
  - Body: lecture_id
  - Response: Booking object

## Teachers
- GET `/teachers/{teacher_id}/courses`
  - Param: teacher_id
  - Response: List of all courses the teacher is giving
- GET `/teachers/{teacher_id}/lectures`
  - Param: teacher_id
  - Response: List of all lectures the teacher is giving
- GET `/teachers/{teacher_id}/lectures?from=<start_date>&to=<end_date>`
  - Param: teacher_id
  - Response: List of all lectures the teacher is giving in a certain time period
- POST `/teachers`
  - Body: Teacher opject
  - Response: Response status
  
  
##### NOTE: Reference resource: https://developers.google.com/gmail/api/reference/rest 
<!-- API does not include possible DELETE needed -->