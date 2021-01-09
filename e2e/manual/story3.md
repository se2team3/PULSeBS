# Story 3



As a teacher I want to access the list of students booked for my lectures so that I am informed

<br>

///////////////////////////////<br>
////Might be extended////<br>
///////////////////////////////<br>

| Test ID | S3_0 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Setup for Story 3 |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to login page displaying "email" and "password" inputs |
| 2 | Insert teacher`s email and passwords as "Ines.Beneventi@politu.it" and "passw0rd", click "login" button | Redirecting to  http://localhost:3000/calendar and where schedule of teacher is displayed|


<br>

| Test ID | S3_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Checking list of students |
| **Steps** | Operator actions | Expected results |
| 1 | Following S3_0, select any lecture in the displayed schedule (e.g. "Metodi di finanziamento delle imprese" on Monday, March 1, 2021) | redirecting to http://localhost:3000/lectures/1 which shows list of students booked on single lecture |




<br>

*These fields fill be edited/extended after having proper access to the Pulsebs (No proper DB yet)
