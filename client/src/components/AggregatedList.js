import React from 'react';
import { Nav, ListGroup } from 'react-bootstrap';
import {AggregationLevel} from './common';


const AggregatedList = (props) => {
    const { elements, aggregationLevel, handleClick } = props;
    if (aggregationLevel === AggregationLevel.NotSet)
        return null;
    return (
        <>
            <Nav className="px-4 py-4 sidebar bg-light">
                <ListGroup variant="flush" className='aggregated-list w-100'>
                    {
                        elements.map((el, idx) => (
                            <ListGroup.Item
                                key={idx}
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
            </Nav>
        </>
    );
}

export default AggregatedList;