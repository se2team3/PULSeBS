# [Story #1]

As a student I want to book a seat for one of my lectures so that I can attend it

/////////////////////////<br>
////THIS IS A STUB////<br>
/////////////////////////<br>


| Test ID | S1_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Login with correct credentials |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to http://localhost:3000/login page displaying "email" and "password" inputs |
| 2 | Fill "E-mail" and "Password" with "Elvino32@pulsebs.com" and "z8mwdz9xqWgaLRf" respectively| redirecting to http://localhost:3000/calendar page displaying weekly schedulue of the student |

| Test ID | S1_2 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Inputting in wrong format |
| **Steps** | Operator actions | Expected results |
| 1 | Visit page at http://localhost:3000 | Redirecting to http://localhost:3000/login page displaying "email" and "password" inputs |
| 2 | Fill "E-mail" field with "Elvino32pulsebs.com","Elvino32@.pulsebs.com","Elvino32@pulsebs.com."  | E-mail field should be padded with red color|


| Test ID | S1_3 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Login with wrong credentials |
| **Steps** | Operator actions | Expected results |
| 1 | Visit page at http://localhost:3000/ | redirecting to http://localhost:3000/login page displaying "E-mail" and "Password" inputs | |
| 2 | Fill "E-mail" and "Passwprd" fields with "Elvino32@pulsebs.com" and "incorrect_password" respectively | Login page should issue "Username or password is incorrect" statement |


<br>


| Test ID | S1_4 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Logout |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to http://localhost:3000/login page displaying "email" and "password" inputs |
| 2 | Fill "E-mail" and "Password" with "Elvino32@pulsebs.com" and "z8mwdz9xqWgaLRf" respectively| Redirecting to http://localhost:3000/calendar page displaying weekly schedulue of the student |
| 3 | Clicking "Logout" button on top-right| Redirecting to http://localhost:3000/login page displaying "email" and "password" inputs  |


| Test ID | S1_5 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Book a seat |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to http://localhost:3000/login page displaying "email" and "password" inputs |
| 2 | Fill "E-mail" and "Password" with "Elvino32@pulsebs.com" and "z8mwdz9xqWgaLRf" respectively| redirecting to http://localhost:3000/calendar page displaying weekly schedulue of the student |
| 3 | Select lecture| Getting confirmation of booking |