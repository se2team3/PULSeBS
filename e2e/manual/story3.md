# Story 3



As a teacher I want to access the list of students booked for my lectures so that I am informed
<br>
///////////////////////////////<br>
////THIS IS A Unfinished////<br>
///////////////////////////////<br>

| Test ID | S3_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Login with teacher`s  credentials |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to login page displaying "email" and "password" inputs |
| 2 | Insert teacher`s email and passwords as "Guelfo.Rossi@pulsebs.com" and "9LKb8L_cLnQOZip", click "login" button | Schedule of teacher is displayed|


<br>

| Test ID | S3_2 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Checking list of students |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to login page displaying "email" and "password" inputs |
| 2 | Insert teacher`s email and passwords as "Guelfo.Rossi@pulsebs.com" and "9LKb8L_cLnQOZip", click "login" button | Teachers schedule is displayed|
| 3 | On the right part of teachers schedule, click courses | Courses are displayed*|





<br>
* These fields fill be edited/extended after having proper access to the Pulsebs (No proper DB yet)