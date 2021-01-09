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
| 2 | Insert teacher`s email and passwords as "Ines.Beneventi@politu.it" and "passw0rd", click "login" button | Redirecting to  http://localhost:3000/calendar and where schedule of teacher is displayed|

| Test ID | S10_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Entering statistics page |
| **Steps** | Operator actions | Expected results |
| 1 | Following S10_0, click "statistics" button on top left part of the page | redirecting to http://localhost:3000/statistics page which displays:<br> 1) Time Frame (start and end dates), <br>2)Aggregation level (Monthly, Weekly, or by lecture), <br>3) Course search form on the left side of the page |


| Test ID | S10_2 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Testing "Time Frame"  |
| **Steps** | Operator actions | Expected results |
| 1 | Following S10_0, click on Start date box and choose it as 1 January, 2021 and click on End Date box and select 31 March  | Inserted time range is visible on Start and end date boxes |
|2 | On aggregation level, click "month" | On right side of time frame panel, only "March 2021" appears|
|3 | Click on "March 2021" | On right side of page, Bar chart and scatter chart plot options are appearing, showing relation betweefree s  frame panel, only "March 2021" appears|


| 2 | Select time frame as 27/12/2020-06/01/2021, aggregation level month, week, and by lecture seperately | Statistics should come up* |

<br>


*These fields fill be edited/extended after having proper access to the Pulsebs (No proper DB yet)
