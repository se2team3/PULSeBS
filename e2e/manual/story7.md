# [Story #7]

As a teacher I want to cancel a lecture up to 1h before its scheduled time

///////////////////////////////<br>
////THIS IS A Unfinished////<br>
///////////////////////////////<br>

| Test ID | S7_0 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Setup for Story 7 |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to login page displaying "email" and "password" inputs |
| 2 | Insert teacher`s email and passwords as "Guelfo.Rossi@pulsebs.com" and "9LKb8L_cLnQOZip", click "login" button | Schedule of teacher is displayed|


| Test ID | S7_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Cancel before 1 hour left to lecture |
| **Steps** | Operator actions | Expected results |
| 1 | Following S7_0, click on lecture that is scheduled more than 1 hour later than current time | selected lecture is highlighted |
| 2 | Click  | Schedule of teacher is displayed|

| Test ID | S7_2 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Cancel lecture that is in less than 1 hour |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | The login page is displayed with no errors |
| 2 | Insert not valid email "email.email.it" | A red border should appear around the email box |
| 3 | Correct the previously inserted email to match "email@email.it" | The red border should disappear |
| ... | ... | ... |

<br>

* These fields fill be edited/extended after having proper access to the Pulsebs (No proper DB yet)