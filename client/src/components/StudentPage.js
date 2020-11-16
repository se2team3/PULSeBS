import React from 'react';
import {Row,Container,Col, Nav,Badge,Form,Modal,Button} from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';



class StudentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      modal:false,
      selected:{extendedProps:{status:null}},
      lectures:[{
        id: 1,
        datetime: "2020-11-19T10:00:00",
        course_id: 1,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2020-11-19T13:00:00",
        course_name:"Physics",
        teacher_name:"Richard",
        teacher_surname: "Feynman",
        room_name:"ROOM4",
        available_seats:35,
        bookable:"closed"
      },
      {
        id: 2,
        datetime: "2020-11-17T17:00:00",
        course_id: 2,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2020-11-17T18:30:00'",
        course_name:"Chemistry",
        teacher_name:"Walter",
        teacher_surname: "White",
        room_name:"ROOM4",
        available_seats:35,
        bookable:"full"
      },
      {
        id: 3,
        datetime: "2020-11-21T10:00:00",
        course_id: 2,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2020-11-21T10:00:00",
        course_name:"Chemistry",
        teacher_name:"Walter",
        teacher_surname: "White",
        room_name:"ROOM4",
        available_seats:42,
        bookable:"booked"
      },
      {
        id: 4,
        datetime: "2020-11-18T13:30:00",
        course_id: 3,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2020-11-18T11:30:00",
        course_name:"Circuit Theory",
        teacher_name:"Alessandro",
        teacher_surname: "Volta",
        room_name:"ROOM4",
        available_seats:42,
        bookable:"free"
      },

      {
        id: 5,
        datetime: "2020-11-16T08:30:00",
        course_id: 4,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2020-11-16TT11:30:00",
        course_name:"Analysis II",
        teacher_name:"Giuseppe",
        teacher_surname: "Lagrange",
        room_name:"ROOM4",
        available_seats:20,
        bookable:"free"
      },
      
    ],

      events:[]
    } 
    this.transformIntoEvents=this.transformIntoEvents.bind(this);
    this.colorize= this.colorize.bind(this);
    this.changeDisplayEvent=this.changeDisplayEvent.bind(this);
    this.prenota=this.prenota.bind(this)
 }


  async componentDidMount(){
    console.log("HERE")
    let ret=this.transformIntoEvents();
  } 


  colorize= function(subjectArray,course_id){
  
    let colorArray=["plum","tomato","green","dodgerBlue","darkOrange","pink",
                  ,"mediumOrchid","coral","lightBlue","sandyBrown","lightSeaGreen",
                  "khaki",,"deepSkyBlue","chocolate","orange","rebeccaPurple","salmon"]
  
    let c=subjectArray[course_id];
    if(c!=undefined)
      return subjectArray;
    else {
      let colorIndex= Math.floor(Math.random()*colorArray.length);
      subjectArray[course_id]=colorArray[colorIndex]
      return subjectArray;
    }
  }

transformIntoEvents=()=>{
  let subjectArray={} 
  this.setState(state =>{
   const list=state.lectures.map((l)=>{
    subjectArray=this.colorize(subjectArray,l.course_id)
    return({lectureId:l.id,
      subjectId:l.course_id,
      subjectName:l.course_name,
      teacher:l.teacher_name+l.teacher_surname,
      status:l.bookable,
      seats:l.available_seats,
      title: l.course_name+l.room_name+"\n"+l.bookable,
      start:l.datetime,end:l.datetime_end,
      backgroundColor:subjectArray[l.course_id],
      display:'auto'});
  });
  return{events:[...list]}
});
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
    

prenota=function(){
  this.setState({modal:false})
}
  




render() { 
  let showArray=[];
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
              //console.log(info.event.title)
              this.setState({modal:true, selected:info.event})
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
                        label={e.subjectName+'-Prof.'+ e.teacher}
                        onClick={(ev)=>this.changeDisplayEvent(e.subjectId,ev)}
                      />
                    </Badge>
                  </h2>
                )}
                else return null
                })}
            </Form>
          </Nav>
        </Col>
      </Row>
    </Container>

    {(this.state.modal===true && this.state.selected.extendedProps.status==="booked")? 
    <Modal.Dialog className="z1">
      <Modal.Header >
        <Modal.Title>{this.state.selected.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {"You have booked a seat for this lecture"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{this.setState({modal:false})}}>Close</Button> 
      </Modal.Footer>
    </Modal.Dialog>
    :<div></div>}

    {(this.state.modal===true && this.state.selected.extendedProps.status==="free")? 
    <Modal.Dialog className="z1">
      <Modal.Header >
        <Modal.Title>{this.state.selected.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {this.state.selected.extendedProps.seats+" available seats"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{this.setState({modal:false})}}>Close</Button> 
        <Button variant="success" onClick={()=>{this.prenota()}}>Book a seat</Button>
      </Modal.Footer>
    </Modal.Dialog>
    :<div></div>}

    {(this.state.modal===true && this.state.selected.extendedProps.status==="full")? 
    <Modal.Dialog className="z1">
      <Modal.Header >
        <Modal.Title>{this.state.selected.title+"\n "}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {"No available seats"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{this.setState({modal:false})}}>Close</Button> 
      </Modal.Footer>
    </Modal.Dialog>
    :<div></div>}

    {(this.state.modal===true && this.state.selected.extendedProps.status==="closed")? 
    <Modal.Dialog className="z1">
      <Modal.Header >
        <Modal.Title>{this.state.selected.title+"\n "}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {"Booking closed"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{this.setState({modal:false})}}>Close</Button> 
      </Modal.Footer>
    </Modal.Dialog>
    :<div></div>}

  </>)
}
}

export default StudentPage
