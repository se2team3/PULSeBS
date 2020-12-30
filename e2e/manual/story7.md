# [Story #7]

As a teacher I want to cancel a lecture up to 1h before its scheduled time

/////////////////////////<br>
////THIS IS A STUB////<br>
/////////////////////////<br>


| Test ID | S7_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Login with correct credentials |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to login page displaying "email" and "password" inputs |

| Test ID | S7_2 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Login with wrong credentials |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | The login page is displayed with no errors |
| 2 | Insert not valid email "email.email.it" | A red border should appear around the email box |
| 3 | Correct the previously inserted email to match "email@email.it" | The red border should disappear |
| ... | ... | ... |

<br>


| Test ID | S7_3 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Logout |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to login page displaying "email" and "password" inputs |


| Test ID | S7_4 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Book a seat |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to login page displaying "email" and "password" inputs |