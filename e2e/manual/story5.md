# [Story #5]



As a student I want to cancel my booking so that I am free

/////////////////////////<br>
////THIS IS A STUB////<br>
/////////////////////////<br>


| Test ID | S5_0 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Setup for story 5 |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to http://localhost:3000/login page displaying "email" and "password" inputs |
| 2 | Fill "E-mail" and "Password" with "s900003@students.politu.it" and "passw0rd" respectively| redirecting to http://localhost:3000/calendar page displaying weekly schedulue of the student |


| Test ID | S5_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Cancelling booked lecture |
| **Steps** | Operator actions | Expected results |
| 1 | Following S5_0, click on a lecture marked as "booked"  | Small pop-up appears, indicating "You have booked a seat for this lecture"|
| 2 | Click on "Cancel booking" | Selected lecture is now marked as "FREE" of "FULL"  |


<br>


