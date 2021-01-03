# API
<!-- Endpoints are meant to be preceded by /api (/operations == /api/operations)-->

## Lectures
- GET `/lectures` 
  - Query: start_datem end_date
  - Response: List of all lectures
- GET `/lectures/{lecture_id}` 
  - Param: lecture_id
  - Response: Extended Lecture object for the given id
- GET `/lectures/{lecture_id}/bookings` 
  - Param: lecture_id
  - Response: List of all bookings for a given lecture
- PATCH: `/lectures/{lecture_id}` 
  - Param lecture_id
  - Body: {virtual: true/false}
  - Response: NONE
- DELETE: `/lectures/{lecture_id}` 
  - Param: lecture_id
  - Response: NONE
  
## Students
- GET `/students/{student_id}/lectures` 
  - Param: student_id
  - Query: from (start_date), to (end_date)
  - Response: List of all lectures the student is entitled to follow
- GET `/students/:lecture_id/` 
  - Param: lecture_id
  - Response: true if the lecture is bookable, false otherwise
- DELETE `/students/{student_id}/lectures/{lecture_id}` x
  - Param: student_id, lecture_id
  - Response: Response status
- POST `/students/{student_id}/bookings` 
  - Param: student_id
  - Body: lecture_id
  - Response: Booking object

## Teachers
- GET `/teachers/{teacher_id}/lectures`
  - Param: teacher_id
  - Query: from (start_date), to (end_date)
  - Response: List of all lectures the teacher is giving in a certain time period

## Suppor Officer
- POST `/setup`
  -Body: dictionary (object containing the CSV information)
  -Response: Response status
  
##### NOTE: Reference resource: https://developers.google.com/gmail/api/reference/rest 
<!-- API does not include possible DELETE needed -->