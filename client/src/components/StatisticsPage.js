import React from 'react';
import {Row, Container, Col, Nav, Badge, Form, ListGroup, Jumbotron, Image} from 'react-bootstrap';
import moment from 'moment';
import { AuthContext } from '../auth/AuthContext';
import CourseBadge from "./CourseBadge"
import API from '../api';

const initialStartDate = moment().add(-1,'month');
const initialEndDate = moment();
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
            aggregationLevel: AggregationLevel.NotSet,
            startDate: initialStartDate,
            endDate: initialEndDate,
            view: {},
            list: [...mockAggregatedList]
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

    onlyUnique = function (value, index, self) {
        return self.indexOf(value) === index;
    }

    handleAggregationLevelClick = (value) => {
        this.setState({aggregationLevel: value});
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
                          <h5 className="mt-1">Average of {view.numberOfLectures} lectures</h5>
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
