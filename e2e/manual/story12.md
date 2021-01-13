# [Story #12]

As a support officer I want to upload the list of students, courses, teachers, lectures, and classes to setup the system

<br>

| Test ID | S12_0 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Setup for Story 12 |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to login page displaying "email" and "password" inputs |
| 2 | Insert officer`s email and passwords as "officer@email.com" and "passw0rd", click "login" button | redirecting to http://localhost:3000/setup which displays  "Students","Teachers", "Courses", "Enrollment", "Schedule" sections|
| 3 | Manually add following lines to csv files, considering that they are not already in the database: <br>1)students.csv:902801,Storytwelvestudentname,Storytwelvestudentsurnamename,Maranello,s902801@students.politu.it,2001-12-07,GE12345678<br>2)professors.csv:d9201,Storytwelveprofessorname,Storytwelveprofessorsurname,story12profmail@politu.it,MR12345678 <br> 3)courses.csv:XY3253,5,2,Story12course,d9201 <br>4)enrollment.csv:XY3253,902801<br>5)schedule.txt:XY3253,8,Mon,50,8:30:10:00 | Lines added to csv files which will be used to upload to setup|



<br>

| Test ID | S12_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Upload .csv files |
| **Steps** | Operator actions | Expected results |
| 1 | Following S12_0, click on the empty fields next to each category to open the upload pop-up | For each category small pop-up opened, displaying Windows Explorer to locate the needed .csv file |
| 2 | For each category, select correct .csv files, then click upload | First five rows of each file is displayed|
| 3 | Click "Submit all" button | Success message displays|
| 4 | Check student page of student s902801@students.politu.it with password "passw0rd", which will confirm successfull setup of students.csv |student page is available to log in|
| 5 | Check student page to see if a course named "Story12course" is inserted in course table, which will confirm successful setup of courses.csv and enrollment.csv |Course name is visible on the right side of page |
| 6 | Check schedule of student to see if a course named "Story12course" is inserted in Monday 8.30 in students table, which will confirm successful setup of schedule.csv  |Course name is visible on the student schedule |
| 7 | Check page of teacher story12profmail@politu.it with password "passw0rd", which will confirm successfull setup of teachers.csv |Teacher page is available to log in|
| 8 | Check page of teacher to see if a course named "Story12course" is inserted in schedule|Course name is visible on the right side of page |
| 9 | Check schedule of teacher to see if a course named "Story12course" is inserted in Monday 8.30 in schedule, which will confirm successful setup of schedule.csv  |Course name is visible on the right side of page |

<br>

| Test ID | S12_2 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Upload .csv files with drag and drop|
| **Steps** | Operator actions | Expected results |
| 1 | Following S10_0, drag&drop respective .csv files in to empty fields next to each category  | With each drag&drop of respective files, first 5 rows of each .csv file is displayed small pop-up opened, displaying Windows Explorer to locate the needed .csv file |
| 2 | Click "Submit all" button | Success message displays|


<br>

| Test ID | S12_3 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Incomplete upload |
| **Steps** | Operator actions | Expected results |
| 1 | Upload only students.csv | first 5 rows of students.csv is displayed|
| 2 | Try to click "Submit all" button | "Submit all" is grayed and is not functioning|


<br>

| Test ID | S12_4 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Error handling |
| **Steps** | Operator actions | Expected results |
| 1 | Add data to database manually, but the changes is not written yet to DB |Data is added DB |
| 2 | Upload all 5 csv files |Server should respond with details of error |