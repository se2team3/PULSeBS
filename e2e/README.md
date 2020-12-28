# End to end testing

In the directory `manual` there are several `.md` files that represent different "pages" for each story, issue, or category of tasks to be tested.

In the directory `<name of entity>` you may find several `.md` files corresponding to different test attempts, one file for each test attempt. The test attempt references a page in the manual, executing all the tests in that page step by step. A commit hash and date of execution is also reported in the attempt `.md` file.

## How to

Start from the "entity", so a story or a group of horizontal tasks.

Write a manual page for it, describing what are the test cases that should be executed. Detail the test cases writing steps to be executed one after the other, comprising the actions the operator should execute and the expected output.

Each "entity" and each test case should have an ID that is then referenced in "test attempt".

An example of manual page and test attempt file can be found in `manual/template.md` and `story_EXAMPLE/story1_test1.md`. Please don't delete them!

## When an error/unexpected behavior is found

Take a screenshot of the page and the inspect console, report the error in our github issues referencing the test attempt.

## Any question?