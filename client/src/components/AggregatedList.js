import React, { useState } from 'react';
import { Row, ListGroup } from 'react-bootstrap';
import { AggregationLevel } from './common';
import moment from 'moment';

const AggregatedList = (props) => {
    const { aggregationLevel, handleClick } = { ...props };
    const [ active, setActive ] = useState('');

    const getAggregatedLectures = () => {

        const list = {};

        props.lectures.forEach(l => {
            const date = moment(l.datetime, "YYYY-MM-DD HH:mm");
            let aggregationLabel;

            switch (aggregationLevel) {
                case AggregationLevel.Week:
                    aggregationLabel =
                        date.startOf('week').format('DD/MM/YYYY') +
                        ' - ' +
                        date.endOf('week').format('DD/MM/YYYY');
                    break;
                case AggregationLevel.Month:
                    aggregationLabel = date.format('MMMM YYYY');
                    break;
                case AggregationLevel.Lecture:  /* fallthrough */
                default:
                    aggregationLabel = date.format('DD/MM/YY HH:mm') + " " + l.course_name;
            }

            if (!list.hasOwnProperty(aggregationLabel))
                list[aggregationLabel] = [];
            list[aggregationLabel].push(l);
        });

        return Object.keys(list).map(idx => ({
            lectures: list[idx],
            aggregationLabel: idx,
            selected: false
        }));
    }

    const isActive = (aggregationLabel) => {
        //console.log(`dateRange is`, aggregationLabel);
        //console.log(`while active is ${active}`);
        return aggregationLabel === active;
    };

    if (aggregationLevel === AggregationLevel.NotSet)
        return null;
    return (
        <Row>
            <ListGroup variant="flush" className='aggregated-list w-100'>
                {
                    getAggregatedLectures().map((el, idx) => (
                        <ListGroup.Item
                            key={idx}
                            id={idx}
                            action
                            variant='light'
                            id={idx}
                            onClick={() => {
                                setActive(el.aggregationLabel);
                                handleClick(el);
                            }}
                            active={isActive(el.aggregationLabel)}
                            className='shadow-none'
                        >
                            {aggregationLevel !== AggregationLevel.Month && aggregationLevel} {el.aggregationLabel}
                        </ListGroup.Item>
                    ))
                }
            </ListGroup>
        </Row>

    );
}



export default AggregatedList;