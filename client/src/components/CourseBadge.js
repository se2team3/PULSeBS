import React from 'react';
import {Col, Form, Row} from "react-bootstrap";

const CourseBadge = (props) => {
    const style = {
        'backgroundColor': props.backgroundColor,
    };
    return (
        <div className="rounded" style={style}>
            <Row className="mb-3 w-100 d-flex justify-content-between align-items-center">
                <Col lg={1} className="ml-3">
                    <Form.Check
                        id={`check-${props.subjectId}`}
                        type="checkbox"
                        defaultChecked="true"
                        value={props.subjectId}
                        onClick={(ev) => props.handleClick('courseFilter',props.subjectId, ev)}
                    />
                </Col>
                <Col className="align-items-center my-auto" lg={10}>
          <span key={props.lectureId}>
            <span className="font-weight-bold">
              {props.subjectName}
            </span>
            <br/>
            {props.teacher && <span style={{'fontSize': '90%'}}>
              Prof. {props.teacher}
            </span>}
          </span>
                </Col>
            </Row>
        </div>
    );
}

export default CourseBadge;