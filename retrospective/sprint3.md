TEMPLATE FOR RETROSPECTIVE - Team 3
=====================================

Sprint number 3

Table of contents:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done 
    - We commited to 3 stories and we have done 2 of the stories we have committed to, from story 10 to 12
- Total points committed vs done 
    - We have commited to 24 story points and we have done 16 of them
- Nr of hours planned vs spent (as a team)
    - We planned about 68 hours and we spent 72 hours

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
| 0      | 19      |        | 23*        | 24           |
| 10     | 14      | 8      | 9.3        | 15.4         |
| 11     | 22      | 8      | 11.5       | 10           |
| 12     | 30      | 8      | 23.75      | 23           |
   

0.85h average per task, standard deviation 1.4h*

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
    - 68/72 = 0,95 =95 % correct
    - That is ~5% of error in estimation

*\* 12 hours were spent for planning, that encompassed the different group sub-activities (story selection, division in sub-tasks, time estimation for each sub-task)*
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 5.75
  - Total hours spent: 6
  - Nr of automated unit test cases: 93
  - Coverage: 87% (server) + 81% (client), 85% (overall)
- Integration testing:
  - Total hours estimated: 8.85
  - Total hours spent: 8.1
  - Nr of automated tests: 29
- Code review 
  - Total hours estimated: 0.5
  - Total hours spent: 0.3
- Technical Debt management:
  - Total hours estimated: 0m
  - Total hours spent: 30m
      - There is no estimation for this because the debt was managed "live" while coding
  - Hours estimated for remediation by SonarCloud: 1h
  - Hours spent on remediation: 30m
  - debt ratio (as reported by SonarCloud under "Measures-Maintainability")
      - Technical Debt Ratio: 0.1%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
      - Reliability: A
      - Security: A
      - Maintainability: A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
    - Refactoring of some pieces of code was required while developing some tasks to adapt to new requirements that came up after meetings
    - Some small common code objects have been duplicated in development by two different team members (PULSEBS-143)

- What lessons did you learn (both positive and negative) in this sprint?
    - Positive: we have learnt to do new things we previously though were too complex to achieve
    - Negative: we should write more detailed descriptions for tasks, including details mentioned during planning

- Which improvement goals set in the previous retrospective were you able to achieve?
    - Increase code coverage:
        - Tests failures and edge cases
  
- Which ones you were not able to achieve? Why?
    - Code linting: uniform code style and safer practices
    - Simplifications of DB models interfaces
    - Improve documentation

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - Increase quality of the product and reliability

- One thing you are proud of as a Team!!
    - We're proud of having managed correctly some internal organizational problems without damaging the relationships among team members and delivering most of what we commited to.
