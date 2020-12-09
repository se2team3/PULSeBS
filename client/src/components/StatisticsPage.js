import React from 'react';
import {Row, Container, Col, Nav, Form, ListGroup, Image} from 'react-bootstrap';
import moment from 'moment';
import { AuthContext } from '../auth/AuthContext';
import CourseBadge from "./CourseBadge"
import API from '../api';
import Course from "../api/models/course";

const AggregationLevel = {
    Month: 'Month',
    Week: 'Week',
    Lecture: 'Lecture',
    NotSet: ''
}

let momentDate = moment().subtract(2, 'months');
const mockAggregatedList = [];
for (let i = 0; i < 10; i++) {
    const startDate = momentDate.startOf('week').format('DD/MM/YYYY');
    const endDate = momentDate.endOf('week').format('DD/MM/YYYY');
    mockAggregatedList.push({
        id: i,
        startDate,
        endDate,
        numberOfLectures: Math.round(Math.random()*20 + 1),
        selected: false
    });
    momentDate.add(1, 'weeks');
}

class StatisticsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            aggregationLevel: AggregationLevel.NotSet,
            view: {},
            list: [...mockAggregatedList],
            bookings: [],
            courses: []
        }
    }

    async componentDidMount() {
        const bookings = await this.getBookings();
        const courses = this.getCourses(bookings);
        this.setState({ bookings, courses });
    }

    getBookings = async () => {
        try {
            return await API.getTeacherBookings(this.props.authUser?.id);
        }   catch(err) {
            throw err;
        }
    };

    getCourses = (bookings) => {
        const res = [];
        bookings
          .map(b => new Course(b.course_id, b.course_code, b.course_name, this.props.authUser?.id))
          .forEach(c => {
                if (!res.find(added_c => added_c.course_id === c.course_id))
                    res.push(c)
            }
          );
        return res;
    }

    getColor = (course_id) => {
        let colorArray = ["#31a831", "#ed425c", "deepSkyBlue", "darkOrange", "#e37be3",
            "peru", "salmon", "lightBlue", "lightSeaGreen"]
        let ids = this.state.courses.map((c) => c.id).filter(this.onlyUnique);
        let index = ids.indexOf(course_id);

        return colorArray[index];
    }

    onlyUnique = function (value, index, self) {
        return self.indexOf(value) === index;
    }

    handleAggregationLevelClick = (value) => {
        console.log(`You want bookings filtered by ${value}`);
        const list = {};
        /* only for week grouping */
        this.state.bookings.forEach(booking => {
            const isoWeek = moment(booking.lecture_start, "YYYY-MM-DD HH:mm").isoWeek();
            if (!list.hasOwnProperty(isoWeek))
                list[isoWeek] = [];
            list[isoWeek].push(booking);
        })
        const viewList = Object.keys(list).map(idx => {
            const date = moment(list[idx][0].lecture_start);
            return {
                id: idx,
                startDate: date.startOf('week').format('DD/MM/YYYY'),
                endDate: date.endOf('week').format('DD/MM/YYYY'),
                lectures: list[idx],
                selected: false
            }
        });
        this.setState({aggregationLevel: value, list: viewList});
    }

    handleAggregatedListClick = (selected) => {
        this.setState(state => ({
            view: {...selected},
            list: [...state.list.map(el => {
                el.selected = selected.id === el.id;
                return el;
            })]
        }));
    }

    render() {
        return (
            <>
                <AuthContext.Consumer>
                    {(context) => {
                        if (!context.authUser)
                            return null;
                        return (
                            <Container fluid>
                                <Row className='mt-3'>
                                    <Col sm={3}>
                                        <Nav
                                          className="px-4 py-4 col-md-12 d-none d-md-block sidebar"
                                          style={{'backgroundColor': 'rgb(240, 240, 240)'}}
                                        >
                                            <Form>
                                                <fieldset>
                                                    <Form.Group >
                                                        <Form.Label as="legend">
                                                            Aggregation level:
                                                    </Form.Label>
                                                        {Object.keys(AggregationLevel).filter(k => k !== "NotSet").map((k) =>
                                                            <Form.Check
                                                                type="radio"
                                                                label={k}
                                                                id={k}
                                                                name='formAggregationLevel'
                                                                onClick={() => this.handleAggregationLevelClick(k)}
                                                            />)}
                                                    </Form.Group>
                                                </fieldset>
                                                <Form.Group >
                                                    <Form.Label as="legend">
                                                        Time frame:
                                                    </Form.Label>

                                                </Form.Group>
                                                <h2 className="mb-3">Courses</h2>
                                                <Form.Group>
                                                    {
                                                        this.state.courses.map(c => (
                                                          <CourseBadge
                                                            key={c.id}
                                                            backgroundColor={this.getColor(c.id)}
                                                            subjectName={c.name}
                                                            handleClick={() => null}
                                                          />
                                                        ))
                                                    }
                                                </Form.Group>
                                            </Form>

                                        </Nav>
                                    </Col>
                                    <Col sm={3}>
                                        <AggregatedList
                                          handleClick={this.handleAggregatedListClick}
                                          aggregationLevel={this.state.aggregationLevel}
                                          elements={this.state.list}
                                        />
                                    </Col>
                                    <Col sm>
                                        <View
                                            view={this.state.view}
                                            aggregationLevel={this.state.aggregationLevel}
                                        />
                                    </Col>
                                </Row>
                            </Container>

                        )
                    }}


                </AuthContext.Consumer>
            </>)
    }
}

function AggregatedList (props) {
    const { elements, aggregationLevel, handleClick } = props;
    if (aggregationLevel === AggregationLevel.NotSet)
        return null;
    return (
      <>
          <Nav className="px-4 py-4 sidebar bg-light">
              <ListGroup variant="flush" className='aggregated-list'>
                  {
                      elements.map((el, idx) => (
                        <ListGroup.Item
                            key={idx}
                            action
                            variant='light'
                            onClick={() => handleClick(el)}
                            active={el.selected}
                        >
                            {aggregationLevel} {el.startDate} - {el.endDate}
                        </ListGroup.Item>
                      ))
                  }
              </ListGroup>
          </Nav>
      </>
    );
}

function View (props) {
    const { view, aggregationLevel } = props;
    return (
      <>
          <Nav className="px-4 py-4 sidebar">
              <Container>
                  {
                      view.startDate &&
                      <>
                          <h1>{aggregationLevel} {view.startDate} - {view.endDate}</h1>
                          <h5 className="mt-1">{view.lectures.length} lectures</h5>
                          <Row className="justify-content-md-center mt-4">
                              <Col md="10" className="mx-auto">
                                  <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Charts_SVG_Example_6_-_Grouped_Bar_Chart.svg/1200px-Charts_SVG_Example_6_-_Grouped_Bar_Chart.svg.png"
                                    fluid
                                  />
                              </Col>
                          </Row>
                      </>
                  }
              </Container>
          </Nav>
      </>
    );
}

export default StatisticsPage;
