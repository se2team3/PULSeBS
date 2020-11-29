import React from 'react';
import { Modal, Button} from 'react-bootstrap';

const CalendarModal = (props) => {

    let {lecture,bookLecture,closeModal,cancelBooking} = {...props}
    let text = {
        'booked': "You have booked a seat for this lecture",
        'free': `${lecture.extendedProps.seats} available seats`,
        'full': "No available seats",
        'closed': "Booking closed"
      }

    return (
        <Modal show={props.show} onHide={closeModal} size="lg"
        aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header >
                <Modal.Title>{lecture.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {text[lecture.extendedProps.status]}
            </Modal.Body>
            <Modal.Footer>
                {lecture.extendedProps.status === "free" &&
                    <Button variant="success" onClick={bookLecture}>Book a seat</Button>}
                {lecture.extendedProps.status === "booked" &&
                    <Button variant="danger" onClick={cancelBooking}>Cancel booking</Button>}
                <Button variant="secondary" onClick={closeModal}>Close</Button>
                
            </Modal.Footer>
        </Modal>

    );
}

export default CalendarModal;
