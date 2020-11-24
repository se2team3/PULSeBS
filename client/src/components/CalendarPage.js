import React from 'react';
import { Row, Container, Col, Nav, Badge, Form } from 'react-bootstrap';
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
      lectures: [],
      events: [],
      statusFilters: [],
      courseFilters: []
    }

  }


  async componentDidMount() {
    // When created for the first time, it gets the lectures for the current week
    let startOfWeek = moment().day(1).format("YYYY-MM-DD");
    let endOfWeek = moment().day(7).format("YYYY-MM-DD");

    // API.getLectures(startOfWeek, endOfWeek, this.props.authUser.role, this.props.authUser.id)
    API.getLectures(startOfWeek, endOfWeek, 'student',1)
      .then((res) => {
        this.setState({ lectures: res, courseFilters: this.getCourses(res)})
        console.log(this.state.courseFilters);
        // this.transformIntoEvents();
      })
      .catch((err) => console.log(`error`, err));
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

  filteredEvents = ()=>{
    let filteredLectures = this.filterLectures();
    let events = filteredLectures.map((l) => {
      let diff = l.max_seats - l.booking_counter
      let stat = this.getStatus(l)
      return ({
        lectureId: l.id,
        subjectId: l.course_id,
        subjectName: l.course_name,
        teacher: l.teacher_name + l.teacher_surname,
        status: stat,
        seats: diff,
        title: l.course_name + '\n' + l.room_name + "\n" + stat,
        start: l.datetime, end: l.datetime_end,
        backgroundColor: this.getColor(l.course_id),
        display: 'auto'
      });
    });
    return events;
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


  bookLecture = (student_id, lecture_id) => {
    API.bookLecture(student_id, lecture_id)
      .then((res) => {
        let startOfWeek = moment().day(1).format("YYYY-MM-DD");
        let endOfWeek = moment().day(7).format("YYYY-MM-DD");
        API.getLectures(startOfWeek, endOfWeek, this.props.authUser.role, this.props.authUser.id)
          .then((res) => {
            this.setState({ lectures: res })
            this.transformIntoEvents();
          })
          .catch((err) => console.log(`error`, err));
      })
      .catch((err) => {
        console.log(err);
      })

    this.setState({ modal: false })
  }


  closeModal = () => {
    this.setState({ modal: false })
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
        events={this.filteredEvents()}
        eventClick={(info) => {
          if (role === 'student') this.setState({ modal: true, selected: info.event })
          else if (role === 'teacher') this.props.goToLecturePage(info.event);
        }}
        datesSet={(date) => {
          let startDate = moment(date.startStr).format('YYYY-MM-DD');
          let endDate = moment(date.endStr).add(-1, 'days').format('YYYY-MM-DD'); // -1 because it counts up to the next week
        }}
      />
    );
  }



  filterBookedLectures = (ev) => {
    let bookedFilter = ev.target.checked;
    let filteredLectures = bookedFilter?  this.state.lectures.filter((lec) => {
      if (lec.booking_updated_at) return true
      else return false;
    }): this.state.lectures;

    this.setState({events: filteredLectures});
  }

  filterLectures = () => {
    let filteredLectures = this.state.lectures.filter((lec) => {
      let rightCourse = true;
      if (this.state.courseFilters.length > 0) {
        rightCourse = this.state.courseFilters.some((filter) => filter === lec.course_id);
      }

      let rightStatus = true;
      if (this.state.statusFilters.length > 0) {
        rightStatus = this.state.statusFilters.some((filter) => filter === this.getStatus(lec));
      }

      return rightCourse && rightStatus;
    });

    return (filteredLectures.length>0)? filteredLectures : [];
  }

  getCourses(lectures){
    return [...new Set(lectures.map((lec) => lec.course_id))];
  }

  onFilterSelected = (event, filterName, filterValue) => {
    console.log(filterName+ ' ' + filterValue);
    if (event.target.checked) {
      if(filterName==='courseFilter'){
        this.setState(state => {
        const coursesList = state.courseFilters.concat(filterValue);
        return { courseFilters: coursesList };
      });
      }else if(filterName === 'statusFilter'){
        this.setState(state => {
          const stautsList = state.statusFilters.concat(filterValue);
          return { statusFilters: stautsList };
        });
      }
    } else {
      if(filterName==='courseFilter'){
        this.setState(state => {
        const coursesList = state.courseFilters.filter((cf) => cf !== filterValue);
        return { courseFilters: coursesList };
      });
      }else{
        this.setState(state => {
          const statusFilter = state.statusFilters.filter((sf) => sf !== filterValue);
          return { statusFilters : statusFilter };
        });
      }
      
    }
  }

  getCoursesFiltersFromLectures = () =>{
    let showArray = [];
    let filters = this.state.lectures.map((l) => {
      if (showArray.indexOf(l.course_id) === -1) {
        showArray.push(l.course_id)
        return (
          <h2 key={l.id}>
            <Badge style={{ 'backgroundColor': this.getColor(l.course_id) }}>
              <Form.Check
                type="checkbox"
                defaultChecked="true"
                value={l.course_id}
                label={l.course_name + '-Prof.' + l.teacher_name}
                onClick={(ev) => this.onFilterSelected(ev,'courseFilter',l.course_id)}
              />
            </Badge>
          </h2>
        )}});
    return filters;
  }

  render() {
    return (
      <>
        <AuthContext.Consumer>
          {(context) => (
            <Container fluid>
              <Row >
                <Col sm={8} className="below-nav" >
                  {this.renderCalendar(this.props.authUser?.role)}
                </Col>

                <Col sm={4} className="sidebar">
                  <Nav className="col-md-12 d-none d-md-block bg-light sidebar">
                    <h2>Courses</h2>
                    <Form>
                        {this.getCoursesFiltersFromLectures()}
                    </Form>
                  </Nav>
                </Col>
              </Row>
              {this.state.modal ?
                <CalendarModal closeModal={this.closeModal}
                  bookLecture={() => this.bookLecture(context.authUser?.id ?? 1, this.state.selected.extendedProps.lectureId)}
                  lecture={this.state.selected} /> : <></>}

            </Container>

          )}


        </AuthContext.Consumer>
      </>)
  }
}

export default CalendarPage
