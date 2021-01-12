import React from 'react';
import {Button, Nav, Form, InputGroup, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { DateRangePicker } from 'react-dates';
import CourseBadge from "./CourseBadge";
import {AggregationLevel} from './common'


const StatisticsSidebar = (props) => {

const{  startDate, endDate, focusedInput, courses,
        handleSearch, handleFuzzy, fuzzy,
        isCourseSearched, onCheckboxChange, toggleSelected, toggleIsActive } = {...props}

    return (
        <Nav style={{ height: "100%" }}>
            <Form style={{ display: "flex", flexDirection: "column", maxHeight: "100%" }}>
                <Form.Group style={{zIndex: '3'}}>
                    <Form.Label as="legend">
                        Time frame
                    </Form.Label>
                    <DateRangePicker
                        startDate={startDate} // momentPropTypes.momentObj or null,
                        startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                        endDate={endDate} // momentPropTypes.momentObj or null,
                        endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                        onDatesChange={props.onDatesChange} // PropTypes.func.isRequired,
                        focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                        onFocusChange={props.onFocusChange} // PropTypes.func.isRequired,
                        // isOutsideRange={(date)=>moment(date).isAfter(moment())} to disable future dates
                        isOutsideRange={(date) => false}
                        displayFormat='DD/MM/YYYY'
                    />
                    <Button variant='primary' className='mt-3' onClick={props.onAllTimeClick}>All-time</Button>

                </Form.Group>
                <fieldset>
                    <Form.Group >
                        <Form.Label as="legend">
                            Aggregation level
                        </Form.Label>
                        {Object.keys(AggregationLevel).filter((k) => k !== 'NotSet').map((k) =>
                            <Form.Check
                                inline
                                type="radio"
                                label={k}
                                id={k}
                                key={k}
                                name='formAggregationLevel'
                                onClick={() => props.handleAggregationLevelClick(k)}
                            />)}
                    </Form.Group>
                </fieldset>

                <Form.Label as="legend">Courses</Form.Label>
                <SearchBar
                  handleSearch={handleSearch}
                  fuzzy={fuzzy}
                  handleFuzzy={handleFuzzy}
                />
                <ToggleSelected
                  handleClick={toggleSelected}
                  active={toggleIsActive}
                />
                <Form.Group style={{ flex: "1 1 auto", overflowY: "auto", overflowX: "hidden", minHeight: "200px" }}>
                    {
                        courses.filter(isCourseSearched).map(c => (
                            <CourseBadge
                                key={c.id}
                                backgroundColor={props.getColor(c.id)}
                                subjectName={c.course_name}
                                checked={c.selected}
                                subjectId = {c.id}
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

function ToggleSelected(props) {
  const { handleClick, active } = props;
  return (
    <Button
        className='mb-3'
        action="true"
        variant='light'
        onClick={handleClick}
        active={active}
      >
        { active ? 'Deselect All' : 'Select All' }
      </Button>
  );
}

export default StatisticsSidebar;