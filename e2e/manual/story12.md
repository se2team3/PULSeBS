# [Story #12]

As a support officer I want to upload the list of students, courses, teachers, lectures, and classes to setup the system


| Test ID | S12_0 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Setup for Story 12 |
| **Steps** | Operator actions | Expected results |
| 1 | Visit login page at http://localhost:3000 | redirecting to login page displaying "email" and "password" inputs |
| 2 | Insert officer`s email and passwords as "officer@email.com" and "passw0rd", click "login" button | redirecting to http://localhost:3000/setup and "Students","Teachers", "Courses", "Enrollment", "Schedule"|

| Test ID | S12_1 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Upload .csv files |
| **Steps** | Operator actions | Expected results |
| 1 | Following S10_0, click on the empty fields next to each category to open the upload pop-up | For each category small pop-up opened, displaying Windows Explorer to locate the needed .csv file |
| 2 | For each category, select correct .csv files, then click upload | First five rows of each file is displayed|
| 3 | Click "Submit all" button | Success message displays|
| 4 | Check DB manually to see updated datas | New datas are present in the DB*|


<br>

| Test ID | S12_2 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Upload .csv files with drag and drop|
| **Steps** | Operator actions | Expected results |
| 1 | Following S10_0, drag&drop respective .csv files in to empty fields next to each category  | With each drag&drop of respective files, first 5 rows of each .csv file is displayed small pop-up opened, displaying Windows Explorer to locate the needed .csv file |
| 2 | Click "Submit all" button | Success message displays|


<br>

| Test ID | S12_3 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Incomplete upload |
| **Steps** | Operator actions | Expected results |
| 1 | Following S10_0, click on the empty fields next "students" | Small pop-up opened, displaying Windows Explorer to locate the student .csv file |
| 2 | Click "Submit all" button | Error message displays|

| Test ID | S12_3 |  |
| --- | --- | --- |
| **Test description** <td colspan=2> Incomplete upload |
| **Steps** | Operator actions | Expected results |
| 1 | Following S10_0, click on the empty fields next "students" | Small pop-up opened, displaying Windows Explorer to locate the student .csv file |
| 2 | Click "Submit all" button | Error message displays|


*These fields fill be edited/extended after having proper access to the Pulsebs (No proper DB yet)
