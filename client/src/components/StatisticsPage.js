import React from 'react';
import { Row, Container, Col, Nav, Badge, Form } from 'react-bootstrap';
import moment from 'moment';
import { AuthContext } from '../auth/AuthContext';
import CourseBadge from "./CourseBadge"
import API from '../api';

const initialStartDate = moment().add(-1,'month');
const initialEndDate = moment();
const AggregationLevel = {
    Month: 'Month',
    Week: 'Week',
    Lecture: 'Lecture'
}

const mockCourses = [
    {
        id: 1,
        subjectName: 'Signal Theory'
    },
    {
        id: 2,
        subjectName: 'Software Engineering'
    },
    {
        id: 3,
        subjectName: 'Analysis 1'
    },
    {
        id: 4,
        subjectName: 'Physics'
    },
    {
        id: 5,
        subjectName: 'Machine Learning'
    },
    {
        id: 6,
        subjectName: 'Computer Architectures'
    }
];
class StatisticsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lectures: [],
            courseFilters: [],
            aggregationLevel: AggregationLevel.Week,
            startDate: initialStartDate,
            endDate: initialEndDate
        }
    }

    /* componentDidMount() {
        API.getLectures(this.props.authUser?.role, this.props.authUser?.id)
            .then((l) => {
                console.log('Got lectures');
                this.setState({ lectures: l });
            })
            .catch((err) => {
                console.log(err);
            })
    } */


    getColor = (course_id) => {
        let colorArray = ["#31a831", "#ed425c", "deepSkyBlue", "darkOrange", "#e37be3",
            "peru", "salmon", "lightBlue", "lightSeaGreen"]
        let ids = mockCourses.map((l) => l.id).filter(this.onlyUnique);
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

    filterLectures = () => {
        let filteredLectures = this.state.lectures.filter((lec) => {
            let rightCourse = true;
            if (this.state.courseFilters.length > 0) {
                rightCourse = this.state.courseFilters.some((filter) => filter !== lec.course_id);
            }

            let rightStatus = true;
            if (this.state.statusFilters.length > 0) {
                rightStatus = this.state.statusFilters.some((filter) => filter === this.getStatus(lec));
            }

            return rightCourse && rightStatus;
        });

        return (filteredLectures.length > 0) ? filteredLectures : [];
    }


    transformIntoEvents = (l) => {
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
                                <Row className='mt-3'>
                                    <Col sm={3}>
                                        <Nav className="px-4 py-4 col-md-12 d-none d-md-block bg-light sidebar">
                                            <Form>
                                                <fieldset>
                                                    <Form.Group >
                                                        <Form.Label as="legend">
                                                            Aggregation level:
                                                    </Form.Label>
                                                        {Object.keys(AggregationLevel).map((k) =>
                                                            <Form.Check
                                                                type="radio"
                                                                label={k}
                                                                id={k}
                                                                name='formAggregationLevel'
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
                                                        mockCourses.map((e) => {
                                                            if (showArray.indexOf(e.id) === -1) {
                                                                showArray.push(e.id)
                                                                return <CourseBadge
                                                                    key={e.id}
                                                                    backgroundColor={this.getColor(e.id)}
                                                                    subjectName={e.subjectName}
                                                                    handleClick={() => null}
                                                                />
                                                            }
                                                            return null;
                                                        })
                                                    }
                                                </Form.Group>
                                            </Form>

                                        </Nav>
                                    </Col>

                                </Row>
                            </Container>

                        )
                    }}


                </AuthContext.Consumer>
            </>)
    }
}

export default StatisticsPage;
