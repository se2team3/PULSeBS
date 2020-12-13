import React from 'react';
import { Col, Nav, Form, Button} from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import CourseBadge from "./CourseBadge";
import {AggregationLevel} from './common'


const StatisticsSidebar = (props) => {


    const{startDate, endDate, focusedInput, courses, onCheckboxChange} = {...props}

    return (
        <Nav
            className="px-4 py-4 col-md-12 d-none d-md-block sidebar"
            style={{ 'backgroundColor': 'rgb(240, 240, 240)' }}
        >
            <Form>
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
                        displayFormat='DD/MM/YYYY'
                    />
                    <Button variant='primary' className='mt-3' onClick={props.onAllTimeClick}>All-time</Button>

                </Form.Group>
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
                
                <h2 className="mb-3">Courses</h2>
                <Form.Group>
                    {
                        courses.map(c => (
                            <CourseBadge
                                key={c.id}
                                backgroundColor={props.getColor(c.id)}
                                subjectName={c.course_name}
                                handleClick={() => onCheckboxChange(c)}
                            />
                        ))
                    }
                </Form.Group>
            </Form>

        </Nav>
    );
}

export default StatisticsSidebar;