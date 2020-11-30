import React from 'react';
import { Row, Container, Col, Nav, Badge, Form } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import moment from 'moment';
import { AuthContext } from '../auth/AuthContext';
import CalendarModal from './CalendarModal';
import CourseBadge from "./CourseBadge"
import API from '../api';

const LectureState={
  canceled: 'canceled',
  closed: 'closed',
  booked: 'booked',
  full: 'full',
  free: 'free',
  remote: 'remote'
}

class CalendarPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      selected: { extendedProps: { status: null } },
      lectures: [],
      events: []
    }
  }

  getLectures = async () => {
    if (!this.props.authUser)
      throw { status: 401, errorObj: "no authUser specified" }
    const lectures = await API.getLectures(this.state.startDate, this.state.endDate, this.props.authUser?.role, this.props.authUser?.id);
    this.setState({ lectures });
    this.transformIntoEvents();
  }

  getStatus = (l) => {
    if (l.deleted_at) return LectureState.canceled; // canceled
    if (l.virtual) return LectureState.remote; // remote Stronger priority
    if ((moment(l.datetime).isBefore(moment().format("YYYY-MM-DD")))) return LectureState.closed // closed
    if (l.booking_updated_at) return LectureState.booked; // booked
    if (l.max_seats - l.booking_counter <= 0) return LectureState.full; // full
    return LectureState.free; // free
  }

  getColor = (course_id) => {
    let colorArray = ["plum", "tomato", "green", "dodgerBlue", "darkOrange", "pink",
      "mediumOrchid", "coral", "lightBlue", "sandyBrown", "lightSeaGreen",
      "khaki", "deepSkyBlue", "chocolate", "orange", "rebeccaPurple", "salmon"]
    let ids = this.state.lectures.map((l) => l.course_id).filter(this.onlyUnique);
    let index = ids.indexOf(course_id);

    return colorArray[index];
  }

  setDates = (date) => {
    let startDate = moment(date.startStr).format('YYYY-MM-DD');
    let endDate = moment(date.endStr).subtract(1, 'days').format('YYYY-MM-DD');
    this.setState({ startDate, endDate }, this.getLectures);
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
    if (filterName === 'courseFilter') {
      this.setState(state => {
        const list = state.events.map((e) => {
          if (e.subjectId === filterValue) {
            e.display = value;
          }
          return e;
        });
        return { events: [...list] }
      });
    } else if (filterName === 'statusFilter') {
      value = (value === 'auto') ? 'none' : 'auto'; // This is due to the current design. Not a scalable solution for multiple status filters
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

  cancelBooking = async (student_id, lecture_id) => {
    try {
      await API.cancelBooking(student_id, lecture_id);
      await this.getLectures();
    } catch(err) {
      console.log(err);
    }
    this.closeModal();
  }

  bookLecture = async (student_id, lecture_id) => {
    try {
      await API.bookLecture(student_id, lecture_id);
      await this.getLectures();
      this.closeModal();
    } catch (err) {
      console.error(err);
    }
  }

  closeModal = () => {
    this.setState({ modal: false })
  }

  eventHandler = (() => {
    return {
      setRole: (role) => this.role = role,
      manipulateDOM: (eventInfo) => {
        return (
          <div style={{ 'fontSize': '110%', 'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden' }}>
            <b className="title">{eventInfo.event.title}</b><br/>
            <i className="room">{eventInfo.event.extendedProps.room}</i><br/>
            {
              eventInfo.view.type === "timeGridWeek" &&
              <div data-cy="booking_status" className="status" style={{ 'color': 'rgb(255, 248, 220)', 'position': 'absolute', 'bottom': 0, 'left': '0.2em' }}>
                <b>{eventInfo.event._def.extendedProps.status.toUpperCase()}</b>
              </div>
            }
          </div>
        )
      },
      onLectureClick: (info) => {
        if (this.role === 'student' && info.event.extendedProps.status !== LectureState.canceled
        && info.event.extendedProps.status !== LectureState.remote) 
        this.setState({ modal: true, selected: info.event });
        else if (this.role === 'teacher') this.props.goToLecturePage(info.event);
      },
      onViewChange: async (date) => {
        this.setDates(date);
      },
      setClickable: (arg) => {
        if (arg.event.extendedProps.status === LectureState.canceled 
          || arg.event.extendedProps.status === LectureState.remote) {
          return [ 'canceled' ]
        } else {
          return [ 'clickable' ]
        }
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
        eventClassNames={this.eventHandler.setClickable}
      />
    );

  }


  render() {
    let showArray = [];
    return (
      <>
        <AuthContext.Consumer>
          {(context) => {
            if (!context.authUser)
              return null;
            return (
              <Container fluid>
                <Row>
                  <Col sm={9} className="below-nav calendar" >
                    {this.renderCalendar(this.props.authUser?.role)}
                  </Col>

                  <Col sm={3} className="sidebar">
                    {(this.props.authUser?.role === 'student') ?
                    <Badge className='ml-2'>
                      <Form.Check type="checkbox"

                        defaultChecked={false}
                        label='Booked'
                        style={{ fontSize: 20 }}
                        onClick={(ev) => this.changeDisplayEvent('statusFilter', LectureState.booked, ev)}
                      />
                    </Badge>
                    :<Badge className='ml-2'>
                    <Form.Check type="checkbox"

                      defaultChecked={false}
                      label='Cancelled'
                      style={{ fontSize: 20 }}
                      onClick={(ev) => this.changeDisplayEvent('statusFilter', LectureState.canceled, ev)}
                    />
                  </Badge>}
                    <br/>
                    <Badge className='ml-2'>
                      <Form.Check type="checkbox"
                        defaultChecked={false}
                        label='Remote'
                        style={{ fontSize: 20 }}
                        onClick={(ev) => this.changeDisplayEvent('statusFilter', LectureState.remote, ev)}
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
                                key={e.subjectId}
                                {...e}
                                handleClick={this.changeDisplayEvent}
                              />
                            }
                            return null;
                          })
                        }
                      </Form>
                    </Nav>
                  </Col>
                </Row>
                <CalendarModal show={this.state.modal} closeModal={this.closeModal}
                  bookLecture={() => this.bookLecture(context.authUser?.id ?? 1, this.state.selected.extendedProps.lectureId)}
                  cancelBooking={() => this.cancelBooking(context.authUser?.id ?? 1, this.state.selected.extendedProps.lectureId)}
                  lecture={this.state.selected} />

              </Container>

            )
          }}


        </AuthContext.Consumer>
      </>)
  }
}

export default CalendarPage;
