import React from 'react';
import { Modal, Button} from 'react-bootstrap';

const CalendarModal = (props) => {

     let {lecture,bookLecture,closeModal} = {...props}
    let text = {
        'booked': "You have booked a seat for this lecture",
        'free': `${lecture.extendedProps.seats} available seats`,
        'full': "No available seats",
        'closed': "Booking closed"
      }

    return (
        <Modal.Dialog className="z1">
            <Modal.Header >
                <Modal.Title>{lecture.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {text[lecture.extendedProps.status]}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
                {lecture.extendedProps.status === "free" ?
                    <Button variant="success" onClick={bookLecture}>Book a seat</Button> : <div></div>}
            </Modal.Footer>
        </Modal.Dialog>

    );
}

export default CalendarModal;
