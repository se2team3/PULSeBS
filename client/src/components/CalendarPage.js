import React from 'react';
import { Row, Container, Col, Nav, Badge, Form} from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import moment from 'moment';
import { AuthContext } from '../auth/AuthContext';
import CalendarModal from './CalendarModal';
import API from '../api';

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      selected: { extendedProps: { status: null } },
      lectures: null,
      events: []
    }

  }


  async componentDidMount() {
    // When created for the first time, it gets the lectures for the current week
    let startOfWeek = moment().day(1).format("YYYY-MM-DD");
    let endOfWeek = moment().day(7).format("YYYY-MM-DD");

    console.log(startOfWeek + ' '+ endOfWeek);
    API.getLectures(startOfWeek,endOfWeek,this.props.authUser.role,this.props.authUser.id)
    .then((res)=>{
      console.log("RES"+res[0].course_id)
      res[3].deleted_at = "2020-11-19 08:30:00.000+01:00";
      //this.setState(state=>{return  state.lectures: [...res] });
      this.setState({lectures:res})
      this.transformIntoEvents();
    })
    .catch((err)=>console.log(`error`, err));
    //this.transformIntoEvents();
  }


  getStatus = (l) => {
    if (l.deleted_at)
      return "canceled";
    if ((moment(l.datetime).isBefore(moment().format("YYYY-MM-DD"))))
      return "closed"
    if (l.booking_updated_at)
      return "booked";
    if (l.max_seats - l.booking_counter <= 0)
      return "full";
    return "free";
  }

  getColor = (course_id) => {
    let colorArray = ["plum", "tomato", "green", "dodgerBlue", "darkOrange", "pink",
      "mediumOrchid", "coral", "lightBlue", "sandyBrown", "lightSeaGreen",
      "khaki", "deepSkyBlue", "chocolate", "orange", "rebeccaPurple", "salmon"]
    let ids = this.state.lectures.map((l) => l.course_id).filter(this.onlyUnique);
    let index = ids.indexOf(course_id);

    return colorArray[index];
  }


  onlyUnique = function (value, index, self) {
    return self.indexOf(value) === index;
  }

  transformIntoEvents = () => {
    this.setState(state => {
      console.log("lectures", state.lectures)
      const list = state.lectures.map((l) => {
        let diff = l.max_seats - l.booking_counter
        let stat = this.getStatus(l)
        return ({
          lectureId: l.id,
          subjectId: l.course_id,
          subjectName: l.course_name,
          teacher: l.teacher_name + " " + l.teacher_surname,
          status: stat,
          seats: diff,
          title: l.course_name,
          room: l.room_name,
          stat: stat,
          start: l.datetime, end: l.datetime_end,
          backgroundColor: this.getColor(l.course_id),
          display: 'auto',
          textColor: 'black'
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
      console.log(res);
      // TODO this could be a function to remove duplication
      let startOfWeek = moment().day(1).format("YYYY-MM-DD");
      let endOfWeek = moment().day(7).format("YYYY-MM-DD");
      API.getLectures(startOfWeek,endOfWeek,this.props.authUser.role,this.props.authUser.id)
          .then((res)=>{
            //this.setState(state=>{return  state.lectures: [...res] });
            this.setState({lectures:res})
            this.transformIntoEvents();
        })
        .catch((err)=>console.log(`error`, err));
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
          if(role ==='student' && info.event.extendedProps.status !== "canceled") this.setState({ modal: true, selected: info.event })
          else if (role ==='teacher') this.props.goToLecturePage(info.event);
        }}
        eventContent={(eventInfo) => {
          return (
            <div style={{'font-size': '110%', 'text-overflow': 'ellipsis', 'white-space': 'nowrap', 'overflow': 'hidden'}}>
              <b className="title">{eventInfo.event.title}</b><br/>
              <i className="room">{eventInfo.event.extendedProps.room}</i><br/>
              {
                eventInfo.view.type !== "dayGridMonth" &&
                <div className="status" style={{'color': 'rgb(255, 248, 220)', 'position': 'absolute', 'bottom': 0, 'left': '0.2em'}}>
                  <b>{eventInfo.event.extendedProps.stat}</b>
                </div>
              }
            </div>
          )}}
        eventClassNames={(arg) => {
          if (arg.event.extendedProps.status === "canceled") {
            return [ 'canceled' ]
          } else {
            return [ 'clickable' ]
          }
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
              <Row>
                <Col sm={9} className="below-nav" >
                  {this.renderCalendar(this.props.authUser?.role)}
                </Col>

                <Col sm={3} className="sidebar">
                  <Nav className="px-4 py-4 col-md-12 d-none d-md-block bg-light sidebar">
                    <h2 className="mb-3">Courses</h2>
                    <Form>
                      {
                        this.state.events.map((e) => {
                          if (showArray.indexOf(e.subjectId) === -1) {
                            showArray.push(e.subjectId)
                            return <CourseBadge
                                key = {e.subjectId}
                                {...e}
                                handleClick = {this.changeDisplayEvent}
                            />
                          }
                        })
                      }
                    </Form>
                  </Nav>
                </Col>
              </Row>
              {this.state.modal ? 
              <CalendarModal closeModal={this.closeModal} 
                bookLecture={()=>this.bookLecture(context.authUser?.id ?? 1,this.state.selected.extendedProps.lectureId)}
                lecture={this.state.selected}/> : <></>}

            </Container>

          )}


        </AuthContext.Consumer>
      </>)
  }
}

function CourseBadge (props) {
  const style = {
    'backgroundColor': props.backgroundColor,
  };
  return (
    <div className="rounded" style={style}>
      <Row className="mb-3 w-100 d-flex justify-content-between align-items-center">
        <Col lg={1} className="ml-3">
          <Form.Check
            type="checkbox"
            defaultChecked="true"
            value={props.subjectId}
            onClick={(ev) => props.handleClick(props.subjectId, ev)}
          />
        </Col>
        <Col className="align-items-center my-auto" lg={10}>
          <span key={props.lectureId}>
            <span className="font-weight-bold">
              {props.subjectName}
            </span>
            <br/>
            <span style={{'fontSize': '90%'}}>
              Prof. {props.teacher}
            </span>
          </span>
        </Col>
      </Row>
    </div>
  );
}

export default CalendarPage
