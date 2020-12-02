# PULSeBS
Pandemic University Lecture Seat Booking System

[![Build Status](https://travis-ci.org/se2team3/PULSeBS.svg?branch=master)](https://travis-ci.org/se2team3/PULSeBS)
[![codecov](https://codecov.io/gh/se2team3/PULSeBS/branch/master/graph/badge.svg?token=UNJUG0BND6)](https://codecov.io/gh/se2team3/PULSeBS)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=se2team3_PULSeBS&metric=alert_status)](https://sonarcloud.io/dashboard?id=se2team3_PULSeBS)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=se2team3_PULSeBS&metric=code_smells)](https://sonarcloud.io/dashboard?id=se2team3_PULSeBS)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=se2team3_PULSeBS&metric=sqale_index)](https://sonarcloud.io/dashboard?id=se2team3_PULSeBS)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=se2team3_PULSeBS&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=se2team3_PULSeBS)

## Run with docker

Here an example with our `latest` image

```bash
sudo docker pull se2team3/pulsebs:latest
sudo docker run -p 80:3000 -p 3001:3001 se2team3/pulsebs:latest
```

The application is then available on port `80` of the host, and is usable with any modern browser once the server has properly started.

Instead of the `latest` image any tag from our [docker hub repository](https://hub.docker.com/r/se2team3/pulsebs/tags) could be used (e.g. `release-x.y.z`).

The `latest` image is automatically built for every change on our `master` branch, the tags starting with `release` correspond to proper releases of the software (they are also automatically built for each tag `x.y.z` found on the `master` branch).

## Setup and run locally

Clone the repository, open a terminal in the directory just created.

Perform `npm install` for both the client and the server.

Then to start the application just `npm start` both client and server.

## Running automated tests

Automated tests are run by Travis CI on every commit on a pull request and periodically on master.

Integration testing on the client side is performed using [cypress](https://www.cypress.io/).

To run automated tests on your machine you could use.

```bash
# in the PULSeBS repository directory
cd client
npm test
npm start:instrumented
npm run cy:run # or npm run cy:open if you want to run cypress tests manually one by one
cd ../server
npm test
```

## Documentation

In the server directory there is a list of the API endpoints available.

In the client/doc folder sketched for the GUI are found.