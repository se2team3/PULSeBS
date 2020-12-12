import React from 'react';
import { Col, Nav, Form} from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import CourseBadge from "./CourseBadge";
import {AggregationLevel} from './common'


const StatisticsSidebar = (props) => {


    const{startDate, endDate, focusedInput, courses} = {...props}

    return (
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
                            {Object.keys(AggregationLevel).filter((k)=> k !== 'NotSet').map((k) =>
                                <Form.Check
                                    type="radio"
                                    label={k}
                                    id={k}
                                    key={k}
                                    name='formAggregationLevel'
                                    onClick={() => props.handleAggregationLevelClick(k)}
                                />)}
                        </Form.Group>
                    </fieldset>
                    <Form.Group >
                        <Form.Label as="legend">
                            Time frame:
                                                    </Form.Label>
                        <DateRangePicker
                            startDate={startDate} // momentPropTypes.momentObj or null,
                            startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                            endDate={endDate} // momentPropTypes.momentObj or null,
                            endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                            onDatesChange={({ startDate, endDate }) => props.onDatesChange({startDate,endDate})} // PropTypes.func.isRequired,
                            focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                            onFocusChange={focusedInput => props.onFocusChange(focusedInput)} // PropTypes.func.isRequired,
                            // isOutsideRange={(date)=>moment(date).isAfter(moment())} to disable future dates
                            isOutsideRange={(date) => false}
                        />

                    </Form.Group>
                    <h2 className="mb-3">Courses</h2>
                    <Form.Group>
                        {
                            courses.map(c => (
                                <CourseBadge
                                    key={c.id}
                                    backgroundColor={props.getColor(c.id)}
                                    subjectName={c.course_name}
                                    handleClick={() => null}
                                />
                            ))
                        }
                    </Form.Group>
                </Form>

            </Nav>
        </Col>
    );
}

export default StatisticsSidebar;