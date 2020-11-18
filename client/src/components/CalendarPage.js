import React from 'react';
import { Row, Container, Col, Nav, Badge, Form, Modal, Button } from 'react-bootstrap';
import FullCalendar, { diffDates } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import moment from 'moment';
import { AuthContext } from '../auth/AuthContext';
import CalendarModal from './CalendarModal';
import API from '../api/API';

/* JUST FOR DEBUGGING PURPOSES */
const role = 'student'// change until login and auth user is implemented

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      selected: { extendedProps: { status: null } },
      /* lectures: [{  //booked
        id: 1,
        datetime: "2020-11-19T10:00:00",
        course_id: 1,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2020-11-19T13:00:00",
        course_name: "Physics",
        teacher_name: "Richard",
        teacher_surname: "Feynman",
        room_name: "ROOM4",
        max_seats: 35,
        booking_counter: 30
      },
      {
        id: 2, //full
        datetime: "2020-11-17T17:00:00",
        course_id: 2,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2020-11-17T18:30:00'",
        course_name: "Chemistry",
        teacher_name: "Walter",
        teacher_surname: "White",
        room_name: "ROOM4",
        max_seats: 35,
        booking_counter: 35
      },
      {
        id: 3, //free
        datetime: "2020-11-21T10:00:00",
        course_id: 2,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2020-11-21T10:00:00",
        course_name: "Chemistry",
        teacher_name: "Walter",
        teacher_surname: "White",
        room_name: "ROOM4",
        max_seats: 42,
        booking_counter: 37
      },
      {
        id: 4,  //free
        datetime: "2020-11-18T13:30:00",
        course_id: 3,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2020-11-18T11:30:00",
        course_name: "Circuit Theory",
        teacher_name: "Alessandro",
        teacher_surname: "Volta",
        room_name: "ROOM4",
        max_seats: 42,
        booking_counter: 20
      },

      {
        id: 5,  //closed
        datetime: "2020-11-16T08:30:00",
        course_id: 4,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2020-11-16TT11:30:00",
        course_name: "Analysis II",
        teacher_name: "Giuseppe",
        teacher_surname: "Lagrange",
        room_name: "ROOM4",
        max_seats: 20,
        booking_counter: 14
      },

      ], */
      lectures:null,
      events: []
    }

  }


  async componentDidMount() {
    // When created for the first time, it gets the lectures for the current week
    let startOfWeek = moment().day(1).format("YYYY-MM-DD");
    let endOfWeek = moment().day(7).format("YYYY-MM-DD");

    console.log(startOfWeek + ' '+ endOfWeek);
    let uid = 10;
    API.getLectures(startOfWeek,endOfWeek,role,uid)
    .then((res)=>{
      console.log("RES"+res[0].course_id)
      //this.setState(state=>{return  state.lectures: [...res] });
      this.setState({lectures:res})
      this.transformIntoEvents();
    })
    .catch((err)=>console.log(`error`, err));
    //this.transformIntoEvents();
  }


  getStatus = (l) => {
    let bookingArray = [true, false, false, false, true];
    if ((moment(l.datetime).isBefore(moment().format("YYYY-MM-DD"))))
      return "closed"
    if (bookingArray[l.id - 1] === true)
      return "booked";
    if (l.max_seats - l.booking_counter <= 0)
      return "full";
    return "free";
  }

  getColor = (course_id) => {
    let colorArray = ["plum", "tomato", "green", "dodgerBlue", "darkOrange", "pink",
      "mediumOrchid", "coral", "lightBlue", "sandyBrown", "lightSeaGreen",
      "khaki", , "deepSkyBlue", "chocolate", "orange", "rebeccaPurple", "salmon"]
    let ids = this.state.lectures.map((l) => l.course_id).filter(this.onlyUnique);
    let index = ids.indexOf(course_id);

    return colorArray[index];
  }


  onlyUnique = function (value, index, self) {
    return self.indexOf(value) === index;
  }

  transformIntoEvents = () => {
    this.setState(state => {
      console.log("ev"+state.lectures)
      const list = state.lectures.map((l) => {
        let diff = l.max_seats - l.booking_counter
        let stat = this.getStatus(l)
        return ({
          lectureId: l.id,
          subjectId: l.course_id,
          subjectName: l.course_name,
          teacher: l.teacher_name + l.teacher_surname,
          status: stat,
          seats: diff,
          title: l.course_name +'\n'+ l.room_name + "\n" + stat,
          start: l.datetime, end: l.datetime_end,
          backgroundColor: this.getColor(l.course_id),
          display: 'auto'
        });
      });
      return { events: [...list] }
    });
  }


  changeDisplayEvent = (subjectId, event) => {
    let value;
    event.target.checked === true ? value = 'auto' : value = "none"
    this.setState(state => {
      const list = state.events.map((e) => {
        if (e.subjectId === subjectId) {
          e.display = value;
        }
        return e;
      });
      return { events: [...list] }
    });
  }


  bookLecture = (student_id,lecture_id)=> {
    // console.log('hello');
    // console.log(student_id+ ' '+ lecture_id);
    API.bookLecture(student_id,lecture_id)
    .then((res)=>{
      // GIVE FEEDBACK TO USER + change status of selected lecture
    })
    .catch((err)=>{
      console.log(err);
    })
    
    this.setState({ modal: false })
  }


  closeModal = () =>{
    this.setState({modal: false})
  }


  renderCalendar = (role) => {
    return (
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, listPlugin]}
        initialView="timeGridWeek"
        expandRows={true}
        firstDay="1"
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        nowIndicator={true}
        allDaySlot={false}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,listWeek,dayGridMonth"
        }}
        events={this.state.events}
        eventClick={(info) => {
          if(role ==='student') this.setState({ modal: true, selected: info.event })
          else if (role ==='teacher') this.props.goToLecturePage(info.event);
        }}
        datesSet={(date) => {
          let startDate = moment(date.startStr).format('YYYY-MM-DD');
          let endDate = moment(date.endStr).add(-1, 'days').format('YYYY-MM-DD'); // -1 because it counts up to the next week
          console.log('START: ' + startDate)
          console.log('END: ' + endDate)
        }}
      />
    );

  }


  render() {
    let showArray = [];
    return (
      <>
        <AuthContext.Consumer>
          {(context) => (
            <Container fluid>
              <Row >
                <Col sm={8} className="below-nav" >
                  {this.renderCalendar(context.authUser?.role ?? role)}
                </Col>

                <Col sm={4} className="sidebar">
                  <Nav className="col-md-12 d-none d-md-block bg-light sidebar">
                    <h2>Courses</h2>
                    <Form>
                      {this.state.events.map((e) => {
                        if (showArray.indexOf(e.subjectId) === -1) {
                          showArray.push(e.subjectId)
                          return (
                            <h2 key={e.lectureId}>
                              <Badge style={{ 'backgroundColor': e.backgroundColor }}>
                                <Form.Check
                                  type="checkbox"
                                  defaultChecked="true"
                                  value={e.subjectId}
                                  label={e.subjectName + '-Prof.' + e.teacher}
                                  onClick={(ev) => this.changeDisplayEvent(e.subjectId, ev)}
                                />
                              </Badge>
                            </h2>
                          )
                        }
                        else return null
                      })}
                    </Form>
                  </Nav>
                </Col>
              </Row>
              {this.state.modal ? 
              <CalendarModal closeModal={this.closeModal} 
                bookLecture={()=>this.bookLecture(context.authUser?.university_id ?? 1,this.state.selected.extendedProps.lectureId)} 
                lecture={this.state.selected}/> : <></>}

            </Container>

          )}


        </AuthContext.Consumer>
      </>)
  }
}

export default CalendarPage
