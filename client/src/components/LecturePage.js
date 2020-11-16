import React from 'react';
import moment from 'moment';
import { Alert, Button, Card, Checkbox, Col, Container, Form, Row, Table } from 'react-bootstrap';

class LecturePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { lecture: this.props.lecture }
    }

    render() {
        let sample_lecture = {
            id: 2,
            datetime: "2020-11-19 08:30:00.000+01:00",
            course_id: 42,
            room_id: 5,
            virtual: false,
            deleted_at: null,
            datetime_end: "2020-11-19 11:30:00.000+01:00",
            course_name: "Physics",
            teacher_name: "Mario",
            teacher_surname: "Rossi",
            room_name: "1B",
            available_seats: 35,
            bookable: "free"
        }

        let number_of_bookings = 0;

        let sample_bookings = [
            {
                lecture_id: 2,
                student_id: 1,
                student_university_id: 123456,
                student_surname: "Rossi",
                student_name: "Mario",
                waiting: false,
                present: false,
                updated_at: "2020-11-19 11:30:00.000+01:00",
                deleted_at: null
            }
        ]

        if(sample_bookings.length > 0) number_of_bookings = sample_bookings.length;

        return (
            <Container>
                <Row>
                    <Col><h1>Lecture of {sample_lecture.course_name}</h1></Col>
                </Row>
                <Row>
                    <Col md={4}>
                        {sample_lecture.deleted_at != null && <Alert variant="danger">
                            This lecture has been <b>cancelled</b>!
                        </Alert>}
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    {moment(sample_lecture.datetime).format('LL')}
                                    <br/>
                                    {moment(sample_lecture.datetime).format('dddd')}
                                    <br/>
                                    {moment(sample_lecture.datetime).format('LT')} - {moment(sample_lecture.datetime_end).format('LT')}
                                </Card.Title>
                                <Card.Text>
                                    {sample_lecture.virtual && <><b>VIRTUAL CLASSROOM</b><br/></>}
                                    {!sample_lecture.virtual&&<>Room: <b>{sample_lecture.room_name}</b><br/></>}
                                    Teacher: {sample_lecture.teacher_surname} {sample_lecture.teacher_name}
                                </Card.Text>
                                {sample_lecture.deleted_at == null && <>
                                    {!sample_lecture.virtual &&<Button block variant="warning">Change to distance lecture</Button>}
                                    <Button block variant="danger">Cancel lecture</Button>
                                </>}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={8}>
                        <h4>Bookings</h4>
                        <p>There are {number_of_bookings} bookings out of {sample_lecture.available_seats} available seats.</p>
                        {number_of_bookings == 0 && <Alert variant="secondary" style={{textAlign: "center"}}>
                            No bookings to show for now, come back later...
                        </Alert>}
                        {number_of_bookings > 0 && <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Waiting list</th>
                                    <th>Present</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sample_bookings.map((b)=>
                                    <tr>
                                        <td>{b.student_university_id}</td>
                                        <td>{b.student_name}</td>
                                        <td>{b.student_surname}</td>
                                        <td>{b.waiting?"Yes":"No"}</td>
                                        <td>{!b.waiting&&<Form.Check type="checkbox" checked={b.present} />}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>}
                    </Col>
                </Row>
            </Container>

        )
    }

}

export default LecturePage