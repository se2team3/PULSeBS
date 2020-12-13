import React from 'react';
import { Row, Container, Col } from 'react-bootstrap';
import moment from 'moment';
import { AuthContext } from '../auth/AuthContext';
import API from '../api';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import StatisticsSidebar from './StatisticsSidebar';
import AggregatedList from './AggregatedList';
import { AggregationLevel } from './common';
import GraphView from './GraphView';



class StatisticsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            aggregationLevel: AggregationLevel.NotSet,
            view: {},
            list: [],
            courses: [],
            lectures: [],
            startDate: moment().add(-1, 'weeks'),
            endDate: moment(),
            focusedInput: null,
            chart: 'bar'
        }
    }

    async componentDidMount() {
        await this.getLecturesAndBookings();
    }



    getLecturesAndBookings = async () => {
        try {
            // TODO consider renaming the API (since we ask for lectures)
            let startDate = moment(this.state.startDate).format('YYYY-MM-DD')
            let endDate = moment(this.state.endDate).format('YYYY-MM-DD')
            const lectures = await API.getTeacherBookings(startDate, endDate);
            const courses = lectures
                .map(l => l.course_id)
                .filter(this.onlyUnique)
                .map(id => lectures.find(l => l.course_id === id));
            this.setState({ lectures, courses });
        } catch (err) {
            throw err;
        }
    };



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
        this.setState({ aggregationLevel: value });
    }

    handleAggregatedListClick = (selected) => {
        this.setState({ view: { ...selected } });
    }

    switchChart = (value) => {
        console.log(value)
        this.setState(state => {
            return { chart: value }
        });
    }

    onDatesChange = ({ startDate, endDate }) => {
        this.setState({ startDate: startDate, endDate: endDate },()=>this.getLecturesAndBookings());
    }

    onFocusChange = (focusedInput) => {
        this.setState({ focusedInput });
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
                                        <StatisticsSidebar startDate={this.state.startDate} endDate={this.state.endDate}
                                            handleAggregationLevelClick={this.handleAggregationLevelClick} onDatesChange={this.onDatesChange}
                                            onFocusChange={this.onFocusChange} getColor={this.getColor} focusedInput={this.state.focusedInput}
                                            courses={this.state.courses} />
                                    </Col>
                                    <Col sm={3}>
                                        <AggregatedList
                                            lectures={this.state.lectures}
                                            handleClick={this.handleAggregatedListClick}
                                            aggregationLevel={this.state.aggregationLevel}
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <GraphView
                                            view={this.state.view}
                                            aggregationLevel={this.state.aggregationLevel}
                                            chart={this.state.chart}
                                            switchChart={this.switchChart}
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


export default StatisticsPage;

/*
getListElements = () => {
        let startDate = this.state.startDate;
        let endDate = this.state.endDate;

        if (!startDate || !endDate) return [];
        let endOfWeek;
        let dates = [];

        // console.log('START: ' + startDate.format('YYYY-MM-DD') + ' END: ' + endDate.format('YYYY-MM-DD'));
        let i = 1;

        do {
            if (moment(startDate).endOf('week').isAfter(endDate)) { // just one interval
                dates.push({ startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD'), selected: false, id: i, numberOfLectures: Math.round(Math.random() * 20 + 1) });
                break;
            }
            endOfWeek = moment(startDate).endOf('week');
            dates.push({ startDate: startDate.format('YYYY-MM-DD'), endDate: endOfWeek.format('YYYY-MM-DD'), selected: false, id: i, numberOfLectures: Math.round(Math.random() * 20 + 1) });

            startDate = moment(endOfWeek).add(1, 'day'); // go to next week and shift startDate
            i++;

        } while (startDate !== endDate && startDate < endDate)

        this.setState({ list: dates })
        return dates;
        // TODO may format in the format required from server

    } */