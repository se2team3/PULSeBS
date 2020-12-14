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
        if (!this.props.authUser)
            throw { status: 401, errorObj: "no authUser specified" }
        try {
            // TODO consider renaming the API (since we ask for lectures)
            let startDate = this.state.startDate && moment(this.state.startDate).format('YYYY-MM-DD')
            let endDate = this.state.endDate && moment(this.state.endDate).format('YYYY-MM-DD')
            let lectures = await API.getLectures(startDate, endDate, this.props.authUser.role, this.props.authUser.id)
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
        if(this.props.authUser.role=='teacher'){
            this.state.courses.map((c)=>c.color=colorArray[ids.indexOf(c.id)])
            return colorArray[index];}
        else {
            this.state.courses.map((c)=>c.color='#31A831')
            return '#31A831'
        }
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

    handleCheckboxChange = (course, status) => {
        const courses = this.state.courses;
        for (let c of courses)
            if (c.course_name === course.course_name)
                c.selected = status !== undefined ? status : !c.selected;

        // TODO find a better way, to avoid nested `setState`s
        this.setState({ courses: [...courses]}, function () {
            const view = this.state.view;
            view.lectures = view.allLectures?.filter(this.isCourseSelected) || [];
            this.setState({ view: {...view} });
          }
        )
    }

    handleSearch = (event) => {
        const search = event.target.value;
        this.setState({ search });
    }

    handleFuzzy = () => {
        this.setState(state => ({ fuzzy: !state.fuzzy }));
    }

    isCourseSearched = (course) => {
        if (!this.state.search || !this.state.search.length)
            return true;
        let pattern = "";
        if (this.state.fuzzy)
            [...this.state.search].forEach(ch => { pattern += `${ch}.*` });
        else
            pattern = this.state.search;
        return (new RegExp(pattern, "i")).test(course.course_name);
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

    toggleSelected = () => {
        const status = !this.state.toggleIsActive;
        this.state.courses.forEach(c => this.handleCheckboxChange(c, status));
        this.setState({ toggleIsActive: status });
    }

    render() {
        
        const lectures = this.state.lectures.filter(this.isCourseSelected);

        return (
            <>
                <AuthContext.Consumer>
                    {(context) => {
                       
                        if (!context.authUser)
                            return null;
                         console.log("in statistic"+context.authUser.role)    
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
                                            handleSearch={this.handleSearch} isCourseSearched={this.isCourseSearched}
                                            handleFuzzy={this.handleFuzzy} fuzzy={this.state.fuzzy}
                                            toggleSelected={this.toggleSelected}
                                            toggleIsActive={this.state.toggleIsActive}
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
                                            AuthUser={context.authUser.role}
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
