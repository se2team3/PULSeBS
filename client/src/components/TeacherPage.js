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
      lectures:[{
        id: 1,
        datetime: "2020-11-19T10:00:00",
        course_id: 1,
        room_id: 5,
        virtual: false,
        deleted_at: null,
        datetime_end: "2020-11-19T13:00:00",
        course_name:"Physics I",
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
        course_name:"Physics II",
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
        course_name:"Physics II",
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
        course_name:"Physics III",
        teacher_name:"Alessandro",
        teacher_surname: "Volta",
        room_name:"ROOM4",
        available_seats:42,
        bookable:"free"
      },

      
      
    ],

      events:[]
    }
    this.transformIntoEvents=this.transformIntoEvents.bind(this);
    this.colorize= this.colorize.bind(this);
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
