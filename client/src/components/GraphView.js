import React from 'react';
import { Row, Container, Col, Nav, Form, ListGroup, ButtonGroup, Button } from 'react-bootstrap';
import Plot from 'react-plotly.js';


const GraphView = (props) => {
    const { view, aggregationLevel, chart, switchChart } = props;
    const { dateRange, lectures } = view;
    let list=[];
    let colorArray = ["#31a831", "#ed425c", "deepSkyBlue", "darkOrange", "#e37be3",
            "peru", "salmon", "lightBlue", "lightSeaGreen"]


    if(lectures!==undefined && lectures.length>0){
        for (let el of lectures){
            let index=list.map(element=>{return element.course_id}).indexOf(el.course_id)
            if(index===-1){
                    list.push({course_id:el.course_id,course:el.course_name,tot_seats:0,tot_bookings:0,num_lectures:0,lectures:[],color:''})
                    index=list.length-1;
            }
                list[index].tot_seats+= el.max_seats
                list[index].tot_bookings+=el.booking_counter
                list[index].num_lectures++;
                list[index].lectures.push({date:el.datetime,booking:el.booking_counter,students:el.max_seats})
                list[index].color=colorArray[index]
        } 
        
    } 
   
    return (
        <>
            <Nav className="px-4 py-4 sidebar">
                <Container>
                    {
                        dateRange?.length &&
                        <>
                            <h1>{aggregationLevel} {dateRange}</h1>
                            <h4 className="mt-1">
                                You have selected  {lectures.length} {lectures.length === 1 ? 'lecture' : 'lectures'}
                            </h4>
                            
                           
                            <ButtonGroup className="mb-2" style={{'marginTop':'25px'}}>
                                <Button onClick={()=>switchChart('bar')}>Bar chart</Button>
                                <Button onClick={()=>switchChart('scatter')}>Scatter Chart</Button>
                            </ButtonGroup>
                            <Row className="justify-content-md-center mt-4">
                                <Col md="10" className="mx-auto">
                                {chart==='bar'?
                                    <Plot 
                                        config={{ displayModeBar: false }}
                                        data={[
                                          {
                                            y:list.map(el=>(el.tot_bookings/el.num_lectures).toFixed(2)),
                                            x: list.map(el=>el.course).map(text => {
                                                let rxp=new RegExp('.{1,10} ','g')
                                                return text.replace(rxp, "$&<br>")
                                            
                                            }),
                                            name:aggregationLevel==='Lecture'?'Bookings':'Bookings (avg)',
                                            marker: {color: 'rgb(49,168,49)',},
                                            width:0.6,
                                            type: 'bar',
                                            hoverinfo:{text:'y+text+name',size:24},
                                            
                                          },
                                            
                                          {
                                            y: list.map(el=>((el.tot_seats-el.tot_bookings)/el.num_lectures).toFixed(2)),
                                            x:list.map(el=>el.course).map(text => {
                                                let rxp=new RegExp('.{1,10} ','g')
                                                return text.replace(rxp, "$&<br>")
                                            
                                            }),
                                            name:aggregationLevel==='Lecture'?'Free seats':'Free seats (avg)',
                                            marker: {
                                            color: 'rgb(0,123,255)',
                                            },
                                            width:0.6,
                                            type: 'bar',
                                            hoverinfo:'y+text+name',
                                            } 
                                        ]}
                                      
                                        layout={{
                                            barmode: 'stack',
                                            title:
                                            {
                                                text: '<b>Bookings statistics</b>',
                                                font: { size: 30 },
                                                x: 0.43,
                                                xanchor: 'center'
                                            },
                                            autosize: true,
                                            legend: {font: { size: 16 },orientation:'h', x:'0.2', y:'-0.17' },
                                            xaxis: { tickfont: { size: 16 } },
                                            yaxis: { tickfont: { size: 16 } },
                                           
                                        }}

                                        style={{
                                            width: '100%',
                                            height: 600
                                        }}
                                        useResizeHandler={true}
                                    />




                                :aggregationLevel!=='Lecture'?
                                    <Plot
                                        data={  list.map((el)=>{ 
                                            return({
                                                x: el.lectures.map((lecture)=>{return lecture.date}),
                                                y: el.lectures.map((lecture)=>{return (lecture.booking/lecture.students)}),
                                                mode: 'lines+markers',
                                                type: 'scatter',
                                                line:{color:el.color, width:2.5},
                                                marker:{color:el.color},
                                                text:el.lectures.map((lecture)=>{return (lecture.booking+' Booked <br>'+(lecture.booking*100/lecture.students).toFixed(0)+'% of seats')}),
                                                name: el.course,
                                                hoverinfo:'text'
                                            })
                                        })}

                                        layout={
                                            {autosize: true,
                                            title:{
                                                text: '<b>Bookings trends</b>',
                                                font: { size: 30 },
                                                x: 0.5,
                                                xanchor: 'center'},
                                            legend: {font: { size: 16 },orientation:'h', y:'-0.17' },
                                            xaxis:{
                                                showline:true,
                                                tickfont: { size: 16 },
                                                titlefont: {
                                                    size: 18,
                                                    color: 'grey'
                                                },
                                             },
                                            yaxis:{
                                                showline:true,
                                                title: {text:'% bookings/total number of seats', 
                                                        standoff: 60},
                                                tickformat: '%', 
                                                //range:[0,1], 
                                                tickfont: { size: 16 },
                                                titlefont: {
                                                    size: 18,
                                                    color: 'grey',
                                                },
                                            }
                                        }}

                                         style={{
                                            width: '100%',
                                            height: 600
                                        }}
                                        useResizeHandler={true}
                                />
                                : <h4>To see lectures trend, please select a larger timeframe.</h4>}
                                    
                                </Col>
                            </Row>
                        </>
                    }
                </Container>
            </Nav>
        </>
    );
}

export default GraphView;