TEMPLATE FOR RETROSPECTIVE - Team 3
=====================================

Table of contents:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done 
    - We commited to 3 stories and we have done all the 3 stories we have committed to
- Total points committed vs done 
    - We have commited to 16 story points and we have done all of them
- Nr of hours planned vs spent (as a team)
    - We planned about 51 hours and we spent 61 hours

### Definition of Done:
 
We have defined a workflow composed of the following steps:


- Code present on Version Control System (Git)
    - Open a branch for each task (more or less)
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

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|:------:|:-------:|:------:|:----------:|:------------:|
| 0      | 13      |        | 32*        | 33           |
| 1      | 5       | 5      | 10         | 14           |
| 2      | 3       | 8      | 2          | 4.5          |
| 3      | 8       | 3      | 7.25       | 9            |
   

2h average per task, standard deviation 3h*

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
    - 51.25/61 = 0.84 = 84% correct
    - That is 16% of error in estimation



*\*10 hours were spent for planning, that encompassed the different group sub-activities (story review and selection, estimation, division in sub-tasks, time estimation for each sub-task)*
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 4
  - Total hours spent: 5h 30m
  - Nr of automated unit test cases: 25
  - Coverage: 66% (server) + 21% (client, Cypress is not counted here, the real coverage is higher than this)
- E2E testing:
  - Total hours estimated: 2.5
  - Total hours spent: 3.5
  - Nr of automated tests: 32
- Code review 
  - Total hours estimated: 2.5
  - Total hours spent: 3
- Technical Debt management:
  - Total hours estimated: 1h 30m
  - Total hours spent: 1h 15m
  - Hours estimated for remediation by SonarQube: 2h and it was reduced to 1h
  - Hours spent on remediation: 1h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
      - Technical Debt Ratio: 0.1%
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
