# Test story7 11/01/2021

Git branch: `master` (Make sure you checked out exactly the branch reported)

Commit hash: 'cde3480c5026a17116211becd904752a473ee163'
<br>

## Test ID: S12_0


### Step 1

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_0/Step1.png) | Visiting login page and inserting officer creditnals, which is "officer@email.com" and "passw0rd" |
| ![login view](./images/S12_0/Step2_1.png) | Setup page is visible |

## Test ID: S12_1


### Step 2

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_1/students.png) | For Studens.csv, first 5 rows are displayed|
| ![login view](./images/S12_1/teachers.png) | For Teachers.csv, first 5 rows are displayed |
| ![login view](./images/S12_1/courses.png) | For Courses.csv, first 5 rows are displayed |
| ![login view](./images/S12_1/enrollment.png) | For Enrollment.csv, first 5 rows are displayed |
| ![login view](./images/S12_1/schedule.png) | For Schedule.csv, first 5 rows are displayed |


### Step 3

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_1/Step3_1.png) | Clicking "Submit All" button|
| ![login view](./images/S12_1/Step3_2.png) | Setup takes couple of seconds|
| ![login view](./images/S12_1/Step3_3.png) | Success message displays|
| ![login view](./images/S12_1/Step3_server_terminal.png) | Server terminal after uploading  *This is due to debug errors in step 6 and 9*|


### Step 4

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_1/Step4_1.png) | Logging in with newly inserted student creditnals|
| ![login view](./images/S12_1/Step4_2.png) | Site directed to students page, confirming successfull setup of "students.csv"|

### Step 5

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_1/Step5.png) | Scrolling to March 1, 2021, course name "story12coursename" is visible, which confirms successful setup of courses.csv and enrollment.csv|


### Step 6

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_1/Step6_error.png) | **ERROR** Scrolling to March 1, 2021, course "story12coursename" is not in schedule, which indicates failure in setup of schedule.csv|
| ![login view](./images/S12_1/Step6_error_console.png) | **ERROR** Console|
| ![login view](./images/S12_1/Step6_error_server_terminal.png) | **ERROR** Server terminal|
| ![login view](./images/S12_1/Step6_error_client_terminal.png) | **ERROR** Client terminal|


### Step 7

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_1/Step7_1.png) | Logging in with newly inserted teahcer creditnals|
| ![login view](./images/S12_1/Step7_2.png) | Site directed to teacher page, confirming successfull setup of "teachers.csv"|

### Step 8

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_1/Step8.png) | Scrolling to March 1, 2021, course name "story12coursename" is visible, which again confirms successful setup of courses.csv|

### Step 9

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_1/Step9_error.png) | **ERROR** Scrolling to March 1, 2021, course "story12coursename" is not in the schedule, which visible, which indicates failure in setup of schedule.csv|
| ![login view](./images/S12_1/Step9_error_console.png) | **ERROR** Console|
| ![login view](./images/S12_1/Step9_error_server_terminal.png) | **ERROR** Server terminal|
| ![login view](./images/S12_1/Step9_error_client_terminal.png) | **ERROR** Client terminal|


## Test ID: S12_2


### Step 1

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_2/Step1.png) |Drag&dropping csv files |

### Step 2

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_1/Step3_3.png) |Success message displays |

## Test ID: S12_3

### Step 1

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_3/Step1.png) |After uploading only one table, system does not allow user to submit the data("Submit all" button is grayed) |


## Test ID: S12_4

### Step 1

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_4/Step1.png) |Manually add fake data to DB but don`t write changes to DB yet|

### Step 2

| Screenshot| Notes OR error |
| --- | --- |
| ![login view](./images/S12_4/Step2_1.png) |In a meantime, uploading all 5 csv files|
| ![login view](./images/S12_4/Step2_2.png) |Server processes...|
| ![login view](./images/S12_4/Step2_3.png) |**ERROR** User is not informed about cause of error|
| ![login view](./images/S12_4/Step2_error_console.png) |**ERROR** Console|
| ![login view](./images/S12_4/Step2_error_server_terminal.png) |**ERROR** Server terminal|
| ![login view](./images/S12_4/Step2_error_client_terminal.png) |**ERROR** Client terminal|
