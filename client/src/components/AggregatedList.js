import React from 'react';
import { Row, ListGroup } from 'react-bootstrap';
import { AggregationLevel } from './common';
import moment from 'moment';

const AggregatedList = (props) => {
    const { aggregationLevel, handleClick } = { ...props };

    const getAggregatedLectures = () => {

        const list = {};

        props.lectures.forEach(l => {
            const date = moment(l.datetime, "YYYY-MM-DD HH:mm");
            let dateRange;

            switch (aggregationLevel) {
                case AggregationLevel.Week:
                    dateRange =
                        date.startOf('week').format('DD/MM/YYYY') +
                        ' - ' +
                        date.endOf('week').format('DD/MM/YYYY');
                    break;
                case AggregationLevel.Month:
                    dateRange = date.format('MMMM YYYY');
                    break;
                case AggregationLevel.Lecture:  /* fallthrough */
                default:
                    dateRange = date.format('DD MMMM YYYY');
            }

            if (!list.hasOwnProperty(dateRange))
                list[dateRange] = [];
            list[dateRange].push(l);
        });

        return Object.keys(list).map(idx => ({
            lectures: list[idx],
            dateRange: idx,
            selected: false
        }));
    }


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
                            onClick={() => handleClick(el)}
                            active={el.selected}
                        >
                            {aggregationLevel !== AggregationLevel.Month && aggregationLevel} {el.dateRange}
                        </ListGroup.Item>
                    ))
                }
            </ListGroup>
        </Row>

    );
}



export default AggregatedList;