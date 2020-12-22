# [Issue/story/category name, e.g. Story #1]

[Issue/story/category story description, e.g. "As a student I want to book a seat for one of my lectures so that I can attend it"]

| Test ID | [Test number e.g S1_1] |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Describe here at an higher level what the test is doing, e.g. "Login with wrong credentials" |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | The login page is displayed with no errors |
| 2 | Insert not valid email "email.email.it" | A red border should appear around the email box |
| 3 | Correct the previously inserted email to match "email@email.it" | The red border should disappear |
| ... | ... | ... |

<br>

| Test ID | S1_2 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Login with correct credentials |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http:// | A view of page... |