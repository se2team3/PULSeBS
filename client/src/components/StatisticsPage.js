import React from 'react';
import { Row, Container, Col, Nav, Form, ListGroup} from 'react-bootstrap';
import moment from 'moment';
import { AuthContext } from '../auth/AuthContext';
import CourseBadge from "./CourseBadge"
import API from '../api';
import Course from "../api/models/course";
import Plot from 'react-plotly.js';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';



const AggregationLevel = {
    Month: 'Month',
    Week: 'Week',
    Lecture: 'Lecture',
    NotSet: ''
}


class StatisticsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            aggregationLevel: AggregationLevel.NotSet,
            view: {},
            list: [],
            courses: [],
            startDate: moment(),
            endDate: moment(),
            focusedInput: null
        }
    }

    async componentDidMount() {
        const lectures = await this.getLectures();
        const courses = lectures
          .map(l => l.course_id)
          .filter(this.onlyUnique)
          .map(id => lectures.find(l => l.course_id === id));
        this.setState({ lectures, courses });
    }

    getLectures = async () => {
        try {
            // TODO consider renaming the API (since we ask for lectures)
            return await API.getTeacherBookings(this.props.authUser?.id);
        } catch (err) {
            throw err;
        }
    };

    getListElements = () => {
        let startDate = this.state.startDate;
        let endDate = this.state.endDate;
        
        if(!startDate || !endDate) return [];
        let endOfWeek;
        let dates = [];

        // console.log('START: ' + startDate.format('YYYY-MM-DD') + ' END: ' + endDate.format('YYYY-MM-DD'));
        let i=1;

        do {
            if (moment(startDate).endOf('week').isAfter(endDate)) { // just one interval
                dates.push({startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD'), selected: false, id:i, numberOfLectures: Math.round(Math.random()*20 + 1)});
                break;
            }
            endOfWeek = moment(startDate).endOf('week');
            dates.push({startDate: startDate.format('YYYY-MM-DD'), endDate: endOfWeek.format('YYYY-MM-DD'), selected: false,id: i,numberOfLectures: Math.round(Math.random()*20 + 1)});

            startDate = moment(endOfWeek).add(1,'day'); // go to next week and shift startDate
            i++;
            
        } while (startDate !== endDate && startDate < endDate)

        this.setState({list: dates})
         return dates;
        // TODO may format in the format required from server

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

    getAggregatedLectures = (level, lectures) => {
        const list = {};

        lectures.forEach(l => {
            const date = moment(l.datetime, "YYYY-MM-DD HH:mm");
            let hash, dateRange;

            // FIXME year collision
            switch (level) {
                case AggregationLevel.Week:
                    hash = date.isoWeek();
                    dateRange =
                      date.startOf('week').format('DD/MM/YYYY') +
                        ' - ' +
                      date.endOf('week').format('DD/MM/YYYY');
                    break;
                case AggregationLevel.Month:
                    hash = date.month();
                    dateRange = date.format('MMMM');
                    break;
                case AggregationLevel.Lecture:  /* fallthrough */
                default:
                    hash = l.id;
                    dateRange = date.format('DD/MM');
            }

            if (!list.hasOwnProperty(hash))
                list[hash] = { dateRange, lectures: []};
            list[hash].lectures.push(l);
        });

        return Object.keys(list).map(idx => {
            return {
                id: idx,
                lectures: list[idx],
                dateRange: list[idx].dateRange,
                selected: false
            }
        });
    }

    handleAggregationLevelClick = (value) => {
        const list = this.getAggregatedLectures(value, this.state.lectures);
        this.setState({ aggregationLevel: value, list });
    }

    handleAggregatedListClick = (selected) => {
        console.log(selected);
        this.setState(state => ({
            view: { ...selected },
            list: this.getListElements().map(el => {
                el.selected = selected.id === el.id;
                return el;
            })
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
                                            style={{ 'backgroundColor': 'rgb(240, 240, 240)' }}
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
                                                                key={k}
                                                                name='formAggregationLevel'
                                                                onClick={() => this.handleAggregationLevelClick(k)}
                                                            />)}
                                                    </Form.Group>
                                                </fieldset>
                                                <Form.Group >
                                                    <Form.Label as="legend">
                                                        Time frame:
                                                    </Form.Label>
                                                    <DateRangePicker
                                                        startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                                                        startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                                                        endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                                                        endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                                                        onDatesChange={({ startDate, endDate }) => { this.setState({ startDate: startDate, endDate: endDate }, () => this.getListElements()) }} // PropTypes.func.isRequired,
                                                        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                                                        onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,

                                                    />

                                                </Form.Group>
                                                <h2 className="mb-3">Courses</h2>
                                                <Form.Group>
                                                    {
                                                        this.state.courses.map(c => (
                                                            <CourseBadge
                                                                key={c.id}
                                                                backgroundColor={this.getColor(c.id)}
                                                                subjectName={c.course_name}
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
                                           lectures={[{course_id:1,course_name:'Analysis I', max_seats:40,booking_counter:20},{course_id:1,course_name:'Analysis I', max_seats:20,booking_counter:17},{course_id:1,course_name:'Analysis I', max_seats:20,booking_counter:16},{course_id:2,course_name:'Analysis II', max_seats:30,booking_counter:20},{course_id:2,course_name:'Analysis II', max_seats:20,booking_counter:10},{course_id:3,course_name:'Chemistry',max_seats:30,booking_counter:10}]}
                                            //lectures={this.state.view.lectures}
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

function AggregatedList(props) {
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
                                {aggregationLevel} {el.dateRange}
                            </ListGroup.Item>
                        ))
                    }
                </ListGroup>
            </Nav>
        </>
    );
}

function View(props) {
    const { view, aggregationLevel,lectures } = props;
    let list=[];
    if(lectures!==undefined && lectures.length>0){
        for (let el of lectures){
        let index=list.map(element=>{return element.course_id}).indexOf(el.course_id)
        if(index===-1){
                list.push({course_id:el.course_id,course:el.course_name,tot_seats:0,tot_bookings:0,num_lectures:0})
                index=list.length-1;
        }
            list[index].tot_seats+= el.max_seats
            list[index].tot_bookings+=el.booking_counter
            list[index].num_lectures++;
        }   
    } 
   

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

                                    <Plot 
                                        config={{ displayModeBar: false }}
                                        data={[
     
                                            {
                                            y:list.map(el=>(el.tot_bookings/el.num_lectures).toFixed(2)),
                                            x: list.map(el=>el.course).map(text => {
                                                let rxp=new RegExp('.{1,10} ','g')
                                                return text.replace(rxp, "$&<br>")
                                            
                                            }),
                                            name:aggregationLevel==='Lecture'?'Bookings':'Bookings (avg)',
                                            marker: {
                                            color: 'rgb(49,168,49)',
                                            },
                                            width:0.6,
                                            type: 'bar',
                                            hoverinfo:'y+text+name'
                                            } ,
                                            
                                            {
                                                y: list.map(el=>((el.tot_seats-el.tot_bookings)/el.num_lectures).toFixed(2)),
                                                x:list.map(el=>el.course).map(text => {
                                                    let rxp=new RegExp('.{1,10} ','g')
                                                    return text.replace(rxp, "$&<br>")
                                                
                                                }),
                                                name:aggregationLevel==='Lecture'?'Free seats':'Free seats (avg)',
                                                marker: {
                                                color: 'rgb(0,123,255)',
                                                },
                                                width:0.6,
                                                type: 'bar',
                                                hoverinfo:'y+text+name',
                                            } 
                                        ]}
                                      
                                      layout={
                                            {
                                                barmode: 'stack',
                                                width: '100%',
                                                height: 600,
                                                title:
                                                {
                                                    text: '<b>Bookings statistics</b>',
                                                    font: { size: 30 },
                                                    x: 0.43,
                                                    xanchor: 'center'
                                                },
                                                legend: {font: { size: 16 },orientation:'h', x:'0.2', y:'-0.17' },
                                                xaxis: { tickfont: { size: 16 } },
                                                yaxis: { tickfont: { size: 16 } },
                                            }
                                        }

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
