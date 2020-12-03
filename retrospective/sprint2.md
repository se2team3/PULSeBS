TEMPLATE FOR RETROSPECTIVE - Team 3
=====================================

Sprint #2

Table of contents:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done 
    - We commited to 6 stories and we have done all the 6 stories we have committed to, from story 4 to 9
- Total points committed vs done 
    - We have commited to 23 story points and we have done all of them
- Nr of hours planned vs spent (as a team)
    - We planned about 68 hours and we spent 67 hours

### Definition of Done:
 
We have defined a workflow composed of the following steps:


- Code present on Version Control System (Git)
    - Open a branch for each story or horizontal task
    - Do most of your work/coding, keep committing and pushing to your feature branch
    - Write some automated tests
    - Open a Pull Request on GitHub
- Unit Tests passing
    - Install and tests passing on Travis CI, triggered for each change on any open pull request
    - Coverage report from Codecov show no significant regression of coverage percentage
    - Sonar cloud checks (duplications, code smells, vulnerabilities, security hotspots, technical debt) are passing
- Code review completed
    - One or two reviews are provided through GitHub and all the comments from the reviewers are addressed

- End-to-End tests performed
    - Perform automated GUI testing and End-to-End testing using Cypress.io, make sure all of them are passing

- Automated docker image "latest" builds correctly

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|:------:|:-------:|:------:|:----------:|:------------:|
| 0      | 21      |        | 40*        | 38           |
| 4      | 5       | 3      | 10         | 14           |
| 5      | 7       | 2      | 2          | 4.5          |
| 6      | 8       | 5      | 7.25       | 9            |
| 7      | 12      | 3      | 10         | 14           |
| 8      | 7       | 5      | 2          | 4.5          |
| 9      | 12      | 5      | 7.25       | 9            |
   

1h average per task, standard deviation 1.5h*

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
    - 68/67 = 1.015 = 99% correct
    - That is ~1% of error in estimation

*\* 12 hours were spent for planning, that encompassed the different group sub-activities (story selection, division in sub-tasks, time estimation for each sub-task)*
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 4
  - Total hours spent: 5h 30m
  - Nr of automated unit test cases: 25
  - Coverage: 66% (server) + 21% (client, Cypress is not counted here, the real coverage is higher than this)
- E2E testing:
  - Total hours estimated: 
  - Total hours spent: 
  - Nr of automated tests: 106
- Code review 
  - Total hours estimated: 2.5
  - Total hours spent: 3
- Technical Debt management:
  - Total hours estimated: 1h 30m
  - Total hours spent: 1h 15m
  - Hours estimated for remediation by SonarQube: 2h and it was reduced to 1h
  - Hours spent on remediation: 1h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
      - Technical Debt Ratio: 0.0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
      - Reliability: A
      - Security: A
      - Maintainability: A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
    - Underestimation of the testing part
    - Some tasks should have been splitted in smaller tasks to better address their complexity
    - We thought emails tasks would have been more time consuming than they actually were

- What lessons did you learn (both positive and negative) in this sprint?
    - Positive: automated testing is very useful to catch regressions
    - Negative: merges can cause troubles if done too quickly

- Which improvement goals set in the previous retrospective were you able to achieve?
    - Conventions and standardization
        - of the API interface
        - in naming objects in the code and in the DB
        - Better code organization, folder structure
        - Divide our work in feature branches, merge only when ready
    - Proper automated testing and coverage monitoring, clear definition of done
    - More coordination, through pair programming and more scrum meetings
  
- Which ones you were not able to achieve? Why?
    - We still need to improve story and task estimation and tasks division
        - We thought we had spent already too much time in planning and started working without continuing planning

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - Better estimation for of time effort for each task, clear division of tasks in
        - code
        - tests
        - review
    - Improve sprint planning time management
        - Divide it in smaller activities with a clear goal

- One thing you are proud of as a Team!!
    - We are proud of having implemented and followed a clear work flow that included automated testing, that we previously lacked, without negatively affecting productivity and stories completion.
