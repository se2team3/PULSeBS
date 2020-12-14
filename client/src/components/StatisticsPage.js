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
            let startDate = this.state.startDate && moment(this.state.startDate).format('YYYY-MM-DD')
            let endDate = this.state.endDate && moment(this.state.endDate).format('YYYY-MM-DD')
            const lectures = await API.getTeacherBookings(startDate, endDate);
            const courses = lectures
                .map(l => l.course_id)
                .filter(this.onlyUnique)
                .map(id => lectures.find(l => l.course_id === id))
                .map(c => ({ ...c, selected: true }));
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
        this.state.courses.map((c)=>c.color=colorArray[ids.indexOf(c.id)])
        return colorArray[index];
    }

    onlyUnique = function (value, index, self) {
        return self.indexOf(value) === index;
    }

    handleAggregationLevelClick = (value) => {
        this.setState({ aggregationLevel: value });
    }

    handleAggregatedListClick = (selected) => {
        // allLectures  handles all the lectures for a specific date range
        // lectures     handles the lectures for selected courses subset
        this.setState({ view: { ...selected, allLectures: [...selected.lectures] } });
    }

    handleCheckboxChange = (course) => {
        const courses = this.state.courses;
        for (let c of courses)
            if (c.course_name === course.course_name)
                c.selected = !c.selected;

        // TODO find a better way, to avoid nested `setState`s
        this.setState({ courses: [...courses]}, function () {
            const view = this.state.view;
            view.lectures = view.allLectures?.filter(this.isCourseSelected) || [];
            this.setState({ view: {...view} });
          }
        )
    }

    switchChart = (value) => {
        this.setState({ chart: value });
    }

    onDatesChange = ({ startDate, endDate }) => {
        this.setState({ startDate: startDate, endDate: endDate, view: {} },()=>this.getLecturesAndBookings());
    }

    onFocusChange = (focusedInput) => {
        this.setState({ focusedInput });
    }

    isCourseSelected = (lecture) => this.state.courses.filter(c => c.selected).map(c => c.course_name).includes(lecture.course_name);

    render() {
        const lectures = this.state.lectures.filter(this.isCourseSelected);

        return (
            <>
                <AuthContext.Consumer>
                    {(context) => {
                        if (!context.authUser)
                            return null;
                        return (
                            <Container fluid style={{flexGrow: 1, display: "flex", flexDirection: "column", minHeight: 0}}>
                                <Row className="flex-nowrap" style={{height: "100%", overflowX: "auto"}}>
                                    <Col sm={2} style={{ 'backgroundColor': 'rgb(240, 240, 240)' }}>
                                        <StatisticsSidebar
                                            startDate={this.state.startDate}
                                            endDate={this.state.endDate}
                                            handleAggregationLevelClick={this.handleAggregationLevelClick}
                                            onDatesChange={this.onDatesChange}
                                            onFocusChange={this.onFocusChange}
                                            onCheckboxChange={this.handleCheckboxChange}
                                            getColor={this.getColor}
                                            focusedInput={this.state.focusedInput}
                                            courses={this.state.courses}
                                            onAllTimeClick={()=>this.onDatesChange({startDate:null,endDate:null})}
                                        />
                                    </Col>
                                    <Col sm={2} className="bg-light" style={{flex: "1 1 auto", overflowY: "auto", overflowX: "hidden", minHeight: 0}}>
                                        <AggregatedList
                                            lectures={lectures}
                                            handleClick={this.handleAggregatedListClick}
                                            aggregationLevel={this.state.aggregationLevel}
                                        />
                                    </Col>
                                    <Col style={{flex: "1 1 auto", overflowY: "auto", overflowX: "hidden", minHeight: 0}}>
                                        <GraphView
                                            view={this.state.view}
                                            aggregationLevel={this.state.aggregationLevel}
                                            chart={this.state.chart}
                                            switchChart={this.switchChart}
                                            courses={this.state.courses}
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
