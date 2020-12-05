TEMPLATE FOR RETROSPECTIVE - Team 3
=====================================

Sprint number 2

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
| 4      | 5       | 3      | 4          | 4.25         |
| 5      | 7       | 2      | 3.6        | 3.9          |
| 6      | 8       | 5      | 4.25       | 3.6          |
| 7      | 12      | 3      | 6          | 7.4          |
| 8      | 7       | 5      | 3.6        | 2.9          |
| 9      | 12      | 5      | 7.33       | 7.4          |
   

0.9h average per task, standard deviation 1.4h*

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
    - 68/67 = 1.015 = 98.5% correct
    - That is ~1.5% of error in estimation

*\* 12 hours were spent for planning, that encompassed the different group sub-activities (story selection, division in sub-tasks, time estimation for each sub-task)*
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 6.8
  - Total hours spent: 6.5
  - Nr of automated unit test cases: 59
  - Coverage: 88.15% (server) + 74.67% (client), 84% (overall)
- Integration testing:
  - Total hours estimated: 9
  - Total hours spent: 9.75
  - Nr of automated tests: 47
- Code review 
  - Total hours estimated: 3
  - Total hours spent: 3.8
- Technical Debt management:
  - Total hours estimated: 1h 30m
  - Total hours spent: 3h
  - Hours estimated for remediation by SonarCloud: 2h and it was reduced to 33m
  - Hours spent on remediation: 3h
  - debt ratio (as reported by SonarCloud under "Measures-Maintainability")
      - Technical Debt Ratio: 0.0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
      - Reliability: A
      - Security: A
      - Maintainability: A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
    - We underestimated how long it takes to fix code duplication, especially related to automated tests
    - Merging conflicts took more than expected

- What lessons did you learn (both positive and negative) in this sprint?
    - Positive: working on few stories at a time based on priority, like at most 3 of them, and then moving to other stories improved throughput
    - Negative: merges with conflicts takes time

- Which improvement goals set in the previous retrospective were you able to achieve?
    - Better estimation of time effort for each task, clear division of tasks
    - Improve sprint planning time management
  
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - Code linting: uniform code style and safer practices
    - Increase code coverage:
        - Tests failures and edge cases
    - Simplifications of DB models interfaces
    - Improve documentation

- One thing you are proud of as a Team!!
    - We're proud of noticing that we're actually getting better in our estimations, and we're improving our team coordination.
