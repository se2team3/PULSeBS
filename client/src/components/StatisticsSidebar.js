import React from 'react';
import {Col, Button, Nav, Form, InputGroup, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import CourseBadge from "./CourseBadge";
import {AggregationLevel} from './common'


const StatisticsSidebar = (props) => {

const{startDate, endDate, focusedInput, courses,
        handleSearch, handleFuzzy, fuzzy, isCourseSearched, onCheckboxChange} = {...props}

    return (
        <Nav style={{ height: "100%" }}>
            <Form style={{ display: "flex", flexDirection: "column", maxHeight: "100%" }}>
                <Form.Group >
                    <Form.Label as="legend">
                        Time frame:
                                                </Form.Label>
                    <DateRangePicker
                        startDate={startDate} // momentPropTypes.momentObj or null,
                        startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                        endDate={endDate} // momentPropTypes.momentObj or null,
                        endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                        onDatesChange={({ startDate, endDate }) => props.onDatesChange({ startDate, endDate })} // PropTypes.func.isRequired,
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
                        {Object.keys(AggregationLevel).filter((k) => k !== 'NotSet').map((k) =>
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
                <SearchBar
                  handleSearch={handleSearch}
                  fuzzy={fuzzy}
                  handleFuzzy={handleFuzzy}
                />
                <Form.Group style={{ flex: "1 1 auto", overflowY: "auto", overflowX: "hidden", minHeight: 0 }}>
                    {
                        courses.filter(isCourseSearched).map(c => (
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

export default StatisticsSidebar;