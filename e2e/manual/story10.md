# [Story #10]

As a teacher I want to access the historical data about bookings so that I can plan better

///////////////////////////////<br>
////THIS IS A Unfinished////<br>
///////////////////////////////<br>


| Test ID | S10_0 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Setup for Story 10 |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to login page displaying "email" and "password" inputs |
| 2 | Insert teacher`s email and passwords as "Guelfo.Rossi@pulsebs.com" and "9LKb8L_cLnQOZip", click "login" button | redirecting to http://localhost:3000/calendar and schedule of teacher is displayed|

| Test ID | S10_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Entering statistics page |
| **Steps** | Operator actions | Expected results |
| 1 | Following S10_0, click "calendar" button on top left part of the page | redirecting to http://localhost:3000/statistics page which displays 1) Time Frame (start and end dates), 2)Aggregation level (Monthly, Weekly, or by lecture), and 3) Course search form on the left side of the page |
| 2 | Select time frame as 27/12/2020-03/01/2021, aggregation level month, week, and by lecture seperately | A red border should appear around the email box |

<br>


* These fields fill be edited/extended after having proper access to the Pulsebs (No proper DB yet)