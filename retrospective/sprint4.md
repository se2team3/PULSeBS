TEMPLATE FOR RETROSPECTIVE - Team 3
=====================================

Sprint number 4

Table of contents:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done 
    - We commited to 4 stories and we have done all the stories we have committed to, story 11 and stories from 13 to 15
- Total points committed vs done 
    - We have commited to 21 story points and we have done 21 of them
- Nr of hours planned vs spent (as a team)
    - We planned about 70 hours and we spent 70 hours

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
    - Perform manual end-to-end tests, following a testing manual document written based on specifications

- Automated docker image "latest" builds correctly

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|:------:|:-------:|:------:|:----------:|:------------:|
| 0      | 54      | -      | 57*        | 55.7         |
| 11     | 1       | 8      | 0.5        | 0.5          |
| 13     | 16      | 5      | 8.9        | 9            |
| 14     | 3       | 5      | 2          | 2.75         |
| 15     | 3       | 3      | 1.83       | 1.83         |
   

0.9h average per task, standard deviation 1.17h*

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
    - 70.16/69.88 = 1.004 =100 % correct
    - The estimation errors balanced out among different tasks

*\* 9.5 hours were spent for planning, that encompassed the different group sub-activities (story selection, division in sub-tasks, time estimation for each sub-task)*
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 5.8
  - Total hours spent: 5.75
  - Nr of automated unit test cases: 109
  - Coverage: 88% (server) + 91% (client), 89.2% (overall)
- Integration testing:
  - Total hours estimated: 3.8
  - Total hours spent: 3.4
  - Nr of automated tests: 85
- End-to-End testing:
  - Total hours estimated: 10
  - Total hours spent: 10
  - Nr of end-to-end tests: 19
- Code review 
  - Total hours estimated: 4.4
  - Total hours spent: 4.5
- Technical Debt management:
  - Total hours estimated: 90m
  - Total hours spent: 60m
      - There is no estimation for this because the debt was managed "live" while coding
  - Hours estimated for remediation by SonarCloud: 0h
  - Hours spent on remediation: 60m
  - Debt ratio (as reported by SonarCloud under "Measures-Maintainability")
      - Technical Debt Ratio: 0.0%
  - Rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
      - Reliability: A
      - Security: A
      - Maintainability: A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
    - 

- What lessons did you learn (both positive and negative) in this sprint?
    - Positive: there is much more to a software project than just coding, every team member should work on tasks that can put their skills to good use
    - Negative: tests need to simulate also less common use cases to really assure no errors are present, more details are often needed

- Which improvement goals set in the previous retrospective were you able to achieve?
    - Increase quality of the product and reliability
        - We implemented manual testing, setting up a testing manual that got executed several times. Each execution corresponded to a report and eventually issues on GitHub.
  
- Which ones you were not able to achieve? Why?
    - All of the goals were achieved

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - Implement more specific automatic tests, following detailed usecases
    - Implement more specific manual tests, following detailed usecases 
    

- One thing you are proud of as a Team!!
    - We're proud of having put every team member to work on tasks on which they could express in the best way their skills.
