process.env.NODE_ENV = 'test';

const dbUtils = require('../utils/db');

const service = require('../services');
const dao = require('../daos');

const server = require('../index');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const supportOfficer = {
  university_id: 'so1',
  email: 'so@pulsebs.com',
  password: 'passw0rd',
  name: 'John',
  surname: 'Smith',
  role: 'officer'
};

const nStudents = 10;
const fixture = {
  teachers: [
    {
      GivenName: "Ines",
      Number: "d9000",
      OfficialEmail: "Ines.Beneventi@politu.it",
      SSN: "XT6141393",
      Surname: "Beneventi"
    }
  ],
  students: [...new Array(nStudents).keys()].map(n => ({
    Birthday: "1991-11-04",
    City: "Poggio Ferro",
    Id: `${n}`,
    Name: "Ambra",
    OfficialEmail: `s${n}@students.politu.it`,
    SSN: "MK97060783",
    Surname: "Ferri"
  })),
  courses: [
    {
      Code: "XY1211",
      Course: "Metodi di finanziamento delle imprese",
      Semester: "1",
      Teacher: "d9000",
      Year: "1"
    },
    {
      Code: "XY4911",
      Course: "Chimica",
      Semester: "2",
      Teacher: "d9000",
      Year: "2"
    }
  ],
  enrollment: [...new Array(nStudents).keys()].reduce((curr, acc, n) => {
    return [
      ...curr,
      {
        Code: 'XY1211',
        Student: `${n}`
      },
      {
        Code: 'XY4911',
        Student: `${n}`
      }
    ];
  }, []),
  schedule: [
    {
      Code: "XY1211",
      Day: "Mon",
      Room: "1",
      Seats: "120",
      Time: "8:30-11:30"
    },
    {
      Code: "XY1211",
      Day: "Thu",
      Room: "1",
      Seats: "120",
      Time: "10:00-13:00"
    },
    {
      Code: "XY4911",
      Day: "Fri",
      Room: "2",
      Seats: "120",
      Time: "10:00-13:00"
    }
  ]
};


const agent = chai.request.agent(server);

describe('Support Officer', function () {
  before('clear db', async () => {
    await dbUtils.reset({ create: true });
  });

  before('create support officer user', async () => {
    try {
      supportOfficer.id = await service.user.insertUser(supportOfficer);
    } catch(err) {
      console.log(`He was already in the db`);
    }
  });

  it('should properly login as a support officer', async () => {
   const { email, password } = supportOfficer;
    const res = await agent.post(`/api/login`).send({ email, password});
    res.should.have.status(200);
    res.body.should.be.an('object');
    const { password: __unused, ...user } = supportOfficer;
    console.log("not used ",__unused)
    res.body.should.deep.include(user);
  });

  it('should upload properly formatted data', async () => {
    const res = await agent.post(`/api/setup`).send(fixture);
    res.should.have.status(201);
  });

  it('should have populated the db with correct translated students', async () => {
    /*  Students  */
    const students = (await Promise.allSettled(
      fixture.students.map(async s => await dao.user.retrieveUserByEmail(s.OfficialEmail))
    )).map(promise => promise.value);
    students.forEach(student => {
      const fixtureStudent = fixture.students.find(f_student => student.email === f_student.OfficialEmail);
      student.university_id.should.be.eql(fixtureStudent.Id);
      student.email.should.be.eql(fixtureStudent.OfficialEmail);
      student.name.should.be.eql(fixtureStudent.Name);
      student.surname.should.be.eql(fixtureStudent.Surname);
    });
  });

  it('should have populated the db with correct translated teachers', async () => {
    /*  Teachers  */
    const teachers = (await Promise.allSettled(
      fixture.teachers.map(async s => await dao.user.retrieveUserByEmail(s.OfficialEmail))
    )).map(promise => promise.value);
    teachers.forEach(teacher => {
      const fixtureTeacher = fixture.teachers.find(f_teacher => teacher.email === f_teacher.OfficialEmail);
      teacher.university_id.should.be.eql(fixtureTeacher.Number);
      teacher.email.should.be.eql(fixtureTeacher.OfficialEmail);
      teacher.name.should.be.eql(fixtureTeacher.GivenName);
      teacher.surname.should.be.eql(fixtureTeacher.Surname);
    });
  });

  it('should have populated the db with correct rooms', async () => {
    /*  Rooms  */
    for (let i = 1; i <= 2; i++) {
      const room = await dao.room.getRoomByName(`${i}`);
      room.should.be.an('object');
      room.name.should.be.eql(`${i}`);
      room.seats.should.be.eql(+ fixture.schedule.filter(s => s.Room === room.name).map(s => s.Seats)[0]);
    }
  });

  it('should have populated the db with correct courses', async () => {
    /*  Courses  */
    const courses = (await Promise.allSettled(
      fixture.courses.map(async c => await dao.course.retrieveCourseByName(c.Course))
    )).map(promise => promise.value);
    courses.forEach(course => {
      const fixtureCourse = fixture.courses.find(f_course => course.name === f_course.Course);
      course.name.should.be.eql(fixtureCourse.Course);
      course.year.should.be.eql(+ fixtureCourse.Year);
      course.semester.should.be.eql(+ fixtureCourse.Semester);
    });
  });

  it('should have populated the db with correctly duplicated lectures', async () => {
    /*  Schedule  */
    const lectures = (await Promise.allSettled(
      fixture.schedule.map(async (c, idx) => await dao.lecture.getLectures(idx))
    )).map(promise => promise.value);
    // FIXME Dummy test here - Do something smarter
    lectures.should.be.an('array').that.has.length.at.least(fixture.schedule.length);
  });

  it('should have enrolled correctly the students to the course', async () => {
    /*  Enrollment  */
    const enrollments = await dao.course_student.retrieveAllStudentsCourses();
    // FIXME Dummy test here - Do something smarter
    enrollments.should.be.an('array').that.has.length.at.least(fixture.enrollment.length);
  });

  it('should raise an error on improperly formatted data', async () => {
    const badFixture = JSON.parse(JSON.stringify(fixture));
    badFixture.courses[0].Teacher = 'notExistingTeacher';
    badFixture.enrollment[0].Student = 'notExistingStudent';
    const res = await agent.post(`/api/setup`).send(badFixture);
    res.should.have.status(400);
  });

  it('should empty the db after an upload error', async () => {
    (await dbUtils.isEmpty()).should.be.eql(true);
  });

  it('should properly logout', async () => {
    const res = await agent.post(`/api/logout`).send();
    res.should.have.status(200);
    res.body.should.be.empty;
  });
});