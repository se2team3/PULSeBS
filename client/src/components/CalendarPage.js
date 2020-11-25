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
      lectures: null,
      events: []
    }

  }

  getLectures = async ({startDate, endDate} = {}) => {
    try {
      const lectures = await API.getLectures(startDate,endDate,this.props.authUser.role,this.props.authUser.id);
      this.setState({lectures});
      this.transformIntoEvents();
    } catch (err) {
      console.error(`error`, err);
    }
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
          start: l.datetime,
          end: l.datetime_end,
          backgroundColor: this.getColor(l.course_id),
          display: 'auto',
          textColor: 'black'
        });
      });
      return { events: [...list] }
    });
  }

  changeDisplayEvent = (filterName, filterValue, event) => {
    let value;
    event.target.checked === true ? value = 'auto' : value = "none"
    if(filterName === 'courseFilter'){
      this.setState(state => {
      const list = state.events.map((e) => {
        if (e.subjectId === filterValue) {
          e.display = value;
        }
        return e;
      });
      return { events: [...list] }
    });
    }else if(filterName === 'statusFilter'){
      value = (value === 'auto')? 'none':'auto'; // This is due to the current design. Not a scalable solution for multiple status filters
      this.setState(state => {
        const list = state.events.map((e) => {
          if (e.status !== filterValue) {
            e.display = value;
          }
          return e;
        });
        return { events: [...list] }
      });
    }
    
  }

  bookLecture = async (student_id,lecture_id) => {
    try {
      await API.bookLecture(student_id, lecture_id);
      /*  date arguments are intentionally missing since it possible to book a lecture
          in the future and it won't be trivial to retrieve the actual view   */
      await this.getLectures();
      this.closeModal();
    } catch (err) {
      console.error(err);
    }
  }

  closeModal = () =>{
    this.setState({ modal: false })
  }

  eventHandler = (() => {
    return {
      setRole: (role) => this.role = role,
      manipulateDOM: (eventInfo) => {
        return (
            <div style={{'fontSize': '110%', 'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden'}}>
              <b>{eventInfo.event.title}</b><br/>
              <i>{eventInfo.event._def.extendedProps.room}</i><br/>
              <div style={{'color': 'rgb(255, 248, 220)', 'position': 'absolute', 'bottom': 0, 'left': '0.2em'}}>
                <b>{eventInfo.event._def.extendedProps.stat}</b>
              </div>
            </div>
        )
      },
      onLectureClick: (info) => {
        if (this.role === 'student')       this.setState({ modal: true, selected: info.event });
        else if (this.role === 'teacher')  this.props.goToLecturePage(info.event);
      },
      onViewChange: async (date) => {
        let startDate = moment(date.startStr).format('YYYY-MM-DD');
        let endDate = moment(date.endStr).subtract(1, 'days').format('YYYY-MM-DD');
        await this.getLectures({startDate, endDate});
      }
    }
  })()

  renderCalendar = (role) => {
    this.eventHandler.setRole(role);
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
        eventClick={this.eventHandler.onLectureClick}
        eventContent={this.eventHandler.manipulateDOM}
        datesSet={this.eventHandler.onViewChange}
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
                <Badge className='ml-2'>
                    <Form.Check type="checkbox"

                defaultChecked={false}
                label='Show only booked'
                style={{fontSize:20}}
                onClick={(ev) => this.changeDisplayEvent('statusFilter','booked',ev)}
              />
                    </Badge>
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
            onClick={(ev) => props.handleClick('courseFilter',props.subjectId, ev)}
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

export default CalendarPage;