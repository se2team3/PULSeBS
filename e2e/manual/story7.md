# [Story #7]

As a teacher I want to cancel a lecture up to 1h before its scheduled time



| Test ID | S7_0 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Setup for Story 7 |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to login page displaying "email" and "password" inputs |
| 2 | Insert teacher`s email and passwords as "Ines.Beneventi@politu.it" and "passw0rd", click "login" button | Redirecting to  http://localhost:3000/calendar and where schedule of teacher is displayed|

| Test ID | S7_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Cancel before 1 hour left to lecture |
| **Steps** | Operator actions | Expected results |
| 1 | Following S7_0, click on lecture that is scheduled more than 1 hour later than current time (e.g. "Metodi Finanzamento delle imprese" on Monday, March 1, 2021)| Redirected to http://localhost:3000/lectures/1 and list of students have book shown on the right side, and details and button "Cancel Lecture" is displayed on the left side |
| 2 | Click on "Cancel Lecture" | "This lecture has been cancelled!"
 message displayed|


| Test ID | S7_2 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Cancel lecture that is in less than 1 hour |
| **Steps** | Operator actions | Expected results |
| 1 | Following S7_0, click on lecture that is scheduled less than 1 hour than current time | "Cancel Lecture" button is unavailable |


