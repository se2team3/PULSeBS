import React from 'react';
import {Row,Container,Col, Nav,Badge,Form,Modal,Button} from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';



class TeacherPage extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      openLecture:false,
      events:[
        {
          lectureId:1,
          subjectId:1,
          subjectName: 'Physics I',
          title: 'Physics I'+" \n" +'ROOM4' + " \n"+"Booking Closed", 
          start:'2020-11-12T10:00:00',end:'2020-11-12T13:00:00',
          backgroundColor:'orange',
          display:'auto'
        //daysOfWeek: [4], startTime:'10:30',endTime:'11:30', if we want to repeat every week
        },
        {
          lectureId:2,
          subjectId:2,
          subjectName:'Physics II',
          title: `Physics II ROOM5S
          42/80 available seats`, 
          start:'2020-11-10T17:00:00',end:'2020-11-10T18:30:00',
          backgroundColor:'green',
          display:'auto'
        },
        {
          lectureId:3,
          subjectId:2,
          subjectName:'Physics II',
          title: `Physics II ROOM5S
          20/80 available seats`, 
          start:'2020-11-14T10:00:00',end:'2020-11-14T11:30:00',
          backgroundColor:'green',
          display:'auto'
        },
        {
          lectureId:4,
          subjectId:3,
          subjectName:'Psysics III',
          title: `Physics III ROOM1B
          20/50 available seats`, 
          start:'2020-11-11T13:30:00',end:'2020-11-11T15:30:00',
          backgroundColor:'red',
          display:'auto'
        }
        ]
    }
    this.changeDisplayEvent=this.changeDisplayEvent.bind(this);
 }


changeDisplayEvent=(subjectId,event)=>{
  let value;
  event.target.checked===true ? value='auto' :value="none"
  this.setState(state => {
    const list = state.events.map((e) => {
      if (e.subjectId===subjectId) {
        e.display=value;
      }
      return e;
    });
   return {events:[...list]}
  });  
}
    
  
render() { let showArray=[];
  return (
   <>
    <Container fluid>
      <Row >
        <Col sm={8} className="below-nav" >
          <FullCalendar 
            plugins={[ timeGridPlugin,dayGridPlugin,listPlugin ]}
            initialView="timeGridWeek"
            expandRows={true}
            firstDay="1"
            slotMinTime= "08:00:00"
            slotMaxTime="20:00:00"
            nowIndicator={true}
            allDaySlot={false}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,listWeek,dayGridMonth"}}
              events= {this.state.events}
            eventClick={(info)=> {
              this.props.goToLecturePage(info.event);
            }}
            /> 
        </Col>

        <Col sm={4} className="sidebar">
        <Nav className="col-md-12 d-none d-md-block bg-light sidebar">
            <h2>Courses</h2>
            <Form>
            { this.state.events.map((e)=>{
              if(showArray.indexOf(e.subjectId)===-1){
                showArray.push(e.subjectId)
              return(
                <h2 key={e.lectureId}>
                  <Badge style={{'backgroundColor': e.backgroundColor}}>
                      <Form.Check 
                        type="checkbox"
                        defaultChecked="true"
                        label={e.subjectName}
                        onClick={(ev)=>this.changeDisplayEvent(e.subjectId,ev)}
                      />
                    </Badge>
                  </h2>
                )}})}
            </Form>
          </Nav>
        </Col>
      </Row>
    </Container>

    
  </>)
}
}

export default TeacherPage
