import React from 'react';
import { Row, Container, Col, Nav, Badge, Form} from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import moment from 'moment';
import { AuthContext } from '../auth/AuthContext';
import CalendarModal from './CalendarModal';
import API from '../api/API';

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      selected: { extendedProps: { status: null } },
      lectures:null,
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
      //this.setState(state=>{return  state.lectures: [...res] });
      this.setState({lectures:res})
      this.transformIntoEvents();
    })
    .catch((err)=>console.log(`error`, err));
    //this.transformIntoEvents();
  }


  getStatus = (l) => {
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
      console.log(res);
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
                  {this.renderCalendar(context.authUser.role)}
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
                bookLecture={()=>this.bookLecture(context.authUser?.id ?? 1,this.state.selected.extendedProps.lectureId)}
                lecture={this.state.selected}/> : <></>}

            </Container>

          )}


        </AuthContext.Consumer>
      </>)
  }
}

export default CalendarPage
