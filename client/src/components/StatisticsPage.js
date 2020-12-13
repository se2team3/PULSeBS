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

    switchChart= (value)=>{
    console.log(value)
    this.setState(state => {
        return {chart: value}
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
                                        // TODO
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
                                                        // isOutsideRange={(date)=>moment(date).isAfter(moment())} to disable future dates
                                                        isOutsideRange={(date)=>false}
                                                    />

                                                </Form.Group>
                                                <h2 className="mb-3">Courses</h2>
                                                <SearchBar
                                                  handleSearch={this.handleSearch}
                                                  fuzzy={this.state.fuzzy}
                                                  handleFuzzy={this.handleFuzzy}
                                                />
                                                <Form.Group>
                                                    {
                                                        this.state.courses.filter(this.isCourseSearched).map(c => (
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


function SearchBar(props) {
    const { handleSearch, handleFuzzy, fuzzy } = props;
    return (
      <Form.Group className="mb-3">
          <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search for course.."
                onChange={handleSearch}
              />
              <InputGroup.Append>
                  <OverlayTrigger
                    placement='right'
                    overlay={
                        <Tooltip id={1}>
                            { fuzzy ? 'Disable' : 'Enable'} fuzzy search
                        </Tooltip>
                    }
                  >
                      <Button
                        variant='light'
                        active={fuzzy}
                        onClick={handleFuzzy}
                      >
                          ⛓️️
                      </Button>
                  </OverlayTrigger>
              </InputGroup.Append>
          </InputGroup>
      </Form.Group>
    );
}

export default StatisticsPage;
