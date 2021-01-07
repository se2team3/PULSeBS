# API
<!-- Endpoints are meant to be preceded by /api (/operations == /api/operations)-->
## Lectures
- GET `/lectures`
  - Param: NONE
  - Response: List of all lectures
- GET `/lectures?from=<start_date>&to=<end_date>`
  - Query: start_date end_date
  - Response: List of all lectures in a given time frame
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
  - Note: This endpoint is used to update the status of a lecture from presence to virtual
- DELETE: `/lectures/{lecture_id}` 
  - Param: lecture_id
  - Response: NONE
  
## Students
- GET `/students/{student_id}/lectures?from=<start_date>&to=<end_date>`
  - Param: student_id
  - Query: from (start_date), to (end_date) - optional
  - Response: List of all lectures the student is entitled to follow in the given time frame
- GET `/students/{lecture_id}/`
  - Param: lecture_id
  - Response: true if the lecture is bookable, false otherwise
  - Note: This endpoint should receive query parameters for time frame
- POST `/students/{student_id}/bookings`
  - Param: student_id
  - Body: lecture_id
  - Response: Booking object
- DELETE `/students/{student_id}/lectures/{lecture_id}`
  - Param: student_id, lecture_id
  - Response: Response status

## Teachers
- GET `/teachers/{teacher_id}/lectures?from=<start_date>&to=<end_date>`
  - Param: teacher_id
  - Query: from (start_date), to (end_date) - optional
  - Response: List of all lectures the teacher is giving in a certain time period

## Suppor Officer
- POST `/setup`
  -Body: dictionary (object containing the CSV information)
  -Response: Response status
  
##### NOTE: Reference resource: https://developers.google.com/gmail/api/reference/rest 
<!-- API does not include possible DELETE needed -->