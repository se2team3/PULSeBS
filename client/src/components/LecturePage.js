import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Alert, Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import API from '../api';

function LecturePage(props) {

    const [/* state */, setState] = useState();
    const [lecture, setLecture] = useState(null);
    const [bookings, setBookings] = useState(null);

    useEffect(() => {
        getLecture(props.lecture_id);
        API.getBookings(props.lecture_id)
            .then((b) => {
                setBookings(b);
            }).catch((e) => { setState(() => { throw e; }) })
    }, [props.lecture_id]);

    let getLecture = (lecture_id) => {
        API.getLecture(lecture_id)
            .then((l) => {
                setLecture(l);
            }).catch((e) => { setState(() => { throw e; }) })
    }

    let cancelLecture = async () => {
        if(lecture){
            API.cancelLecture(lecture.id)
            .then((result)=>{
                getLecture(lecture.id);
            }).catch((e) => { setState(() => { throw e; }) })
        }
    }

    let changeLectureToRemote = async () => {
        if(lecture){
            API.patchLecture(lecture.id, {virtual: true})
            .then((result)=>{
                getLecture(lecture.id);
            }).catch((e) => { setState(() => { throw e; }) })
        }
    }

    let number_of_bookings = 0;

    if (bookings != null) number_of_bookings = bookings.length;

    return (<>
        {lecture != null && <Container>
            <Row>
                <Col><h1>Lecture of {lecture.course_name}</h1></Col>
            </Row>
            <Row>
                <Col md={4}>
                    {!(lecture.deleted_at == null) && <Alert variant="danger">
                        This lecture has been <b>cancelled</b>!
                        </Alert>}
                    {!!(lecture.virtual) && <Alert variant="warning">
                        <b>REMOTE LECTURE</b>
                        </Alert>}
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                {moment(lecture.datetime).format('LL')}
                                <br />
                                {moment(lecture.datetime).format('dddd')}
                                <br />
                                {moment(lecture.datetime).format('LT')} - {moment(lecture.datetime_end).format('LT')}
                            </Card.Title>
                            <Card.Text>
                                {!!(lecture.virtual) && <><b>VIRTUAL CLASSROOM</b><br /></>}
                                {!!(!lecture.virtual) && <>Room: <b>{lecture.room_name}</b><br /></>}
                                    Teacher: {lecture.teacher_surname} {lecture.teacher_name}
                            </Card.Text>
                            {!(lecture.deleted_at != null) && <>
                                {(!lecture.virtual && moment(lecture.datetime).diff(moment(),'minutes') >= 30) && <Button block variant="warning" onClick={changeLectureToRemote}>Change to distance lecture</Button>}
                                {moment(lecture.datetime).diff(moment(),'hours') >= 1&&<Button block variant="danger" onClick={cancelLecture}>Cancel lecture</Button>}
                            </>}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <h4>Bookings</h4>

                    {!!(!lecture.virtual)&&<p>There are {number_of_bookings} bookings out of {lecture.max_seats} available seats.</p>}
                    {!!(!lecture.virtual&&number_of_bookings === 0) && <Alert variant="secondary" style={{ textAlign: "center" }}>
                        No bookings to show for now, come back later...
                        </Alert>}
                    {!!lecture.virtual&&<p>This lecture has been changed from 'presence' to `remote`. There were {number_of_bookings} bookings out of {lecture.max_seats} available seats.</p>}
                    {!(number_of_bookings <= 0) && <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Waiting list</th>
                                {/*<th>Present</th>*/}
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) =>
                                <tr key={b.student_university_id}>
                                    <td>{b.student_university_id}</td>
                                    <td>{b.student_name}</td>
                                    <td>{b.student_surname}</td>
                                    <td>{b.waiting ? "Yes" : "No"}</td>
                                    {/*<td>{!b.waiting && <Form.Check type="checkbox" checked={b.present} />}</td>*/}
                                </tr>
                            )}
                        </tbody>
                    </Table>}
                </Col>
            </Row>
        </Container>}
    </>

    )

}

export default LecturePage