# [Story #1]

As a student I want to book a seat for one of my lectures so that I can attend it

<br>

| Test ID | S1_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Login with correct credentials |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to http://localhost:3000/login page displaying "email" and "password" inputs |
| 2 | Fill "E-mail" and "Password" with "s900003@students.politu.it" and "passw0rd" respectively| redirecting to http://localhost:3000/calendar page displaying weekly schedulue of the student |

<br>

| Test ID | S1_2 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Booking a free lecture |
| **Steps** | Operator actions | Expected results |
| 1 | Following S1_1, find any lecture that is marked as "Free"(e.g. Ingeneria della qualita, on March 8, 2021), and click on it | Small pop-up appears, indicating number of seats available |
| 2 | Click on "Book a seat" button on newly opened pop-up| Selected lecture has changed from "Free" to "Booked" |





<br>

| Test ID | S1_3 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Inputting in wrong format |
| **Steps** | Operator actions | Expected results |
| 1 | Visit page at http://localhost:3000 | Redirecting to http://localhost:3000/login page displaying "email" and "password" inputs |
| 2 | Fill "E-mail" field with "s900003pulsebs.it","s900003@.pulsebs.it"  | E-mail field should be padded with red color and when hovered, tip for correcting error appears|
| 3 | Correct the errors in previous step  |Red paddings disappear|

<br>

| Test ID | S1_4 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Login with wrong credentials |
| **Steps** | Operator actions | Expected results |
| 1 | Visit page at http://localhost:3000/ | redirecting to http://localhost:3000/login page displaying "E-mail" and "Password" inputs | |
| 2 | Fill "E-mail" and "Password" fields with "s900003@students.politu.it" and "incorrect_password" respectively | Login page should issue "Username or password is incorrect" statement |


<br>


| Test ID | S1_5 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Logout |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to http://localhost:3000/login page displaying "email" and "password" inputs |
| 2 | Fill "E-mail" and "Password" with s900003@students.politu.it" and "passw0rd"  respectively| Redirecting to http://localhost:3000/calendar page displaying weekly schedulue of the student |
| 3 | Clicking "Logout" button on top-right| Redirecting to http://localhost:3000/login page displaying "email" and "password" inputs  |

