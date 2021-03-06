import React from 'react';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import Plot from 'react-plotly.js';
import { AggregationLevel } from './common';

const GraphView = (props) => {
    const { view, aggregationLevel, chart, switchChart, courses, AuthUser } = props;
    const { aggregationLabel, lectures } = view;
    // let AuthUser='teacher'
    let list = [];

    if (lectures !== undefined && lectures.length > 0) {
        for (let el of lectures) {
            let index = list.map(element => { return element.course_id }).indexOf(el.course_id)
            if (index === -1) {
                list.push({ course_id: el.course_id, course: el.course_name, tot_seats: 0, tot_bookings: 0, tot_waiting: 0, num_lectures: 0, lectures: [], color: '', tot_cancellations: 0, })
                index = list.length - 1;
            }
            list[index].tot_seats += (el.max_seats - el.booking_counter)
            list[index].tot_bookings += el.booking_counter
            //if (AuthUser!=='teacher') list[index].tot_bookings-=el.cancellation_counter
            list[index].tot_cancellations += el.cancellation_counter
            list[index].tot_waiting += el.waiting_counter
            list[index].num_lectures++;
            list[index].lectures.push({ date: el.datetime, booking_counter: el.booking_counter, students: el.max_seats, cancellation_counter: el.cancellation_counter, waiting_counter: el.waiting_counter })
            let coursex = courses.filter((c) => { return c.course_id === el.course_id })
            list[index].color = coursex[0].color


        }
    }

    return (
        <Row>
            <Col>
                {
                    aggregationLabel?.length &&
                    <>
                        <h1>{aggregationLevel} {aggregationLabel}</h1>
                        {aggregationLevel !== AggregationLevel.Lecture && <h4 className="mt-1">
                            You have selected  {lectures.length} {lectures.length === 1 ? 'lecture' : 'lectures'}
                        </h4>}


                        <ButtonGroup className="mb-2" style={{ 'marginTop': '25px' }}>
                            <Button onClick={() => switchChart('bar')}>Bar chart</Button>
                            <Button onClick={() => switchChart('scatter')}>Scatter chart</Button>
                        </ButtonGroup>
                        <Row>
                            <Col>
                                {chart === 'bar' ?
                                    <Plot
                                        config={{ displayModeBar: false }}
                                        data={[

                                            retrieveBarElement(list, aggregationLevel, 'tot_bookings', 'Bookings'),
                                            AuthUser !== 'teacher' ? retrieveBarElement(list, aggregationLevel, 'tot_cancellations', 'Cancellations') : {},
                                            AuthUser !== 'teacher' ? retrieveBarElement(list, aggregationLevel, 'tot_waiting', 'In waiting') : {},
                                            retrieveBarElement(list, aggregationLevel, 'tot_seats', 'Free seats')


                                        ]}

                                        layout={{
                                            barmode: 'stack',
                                            title:
                                            {
                                                text: 'Bookings statistics',
                                                font: { size: 24 }
                                            },
                                            legend: { orientation: 'h', side: 'top' }
                                        }}
                                        style={{
                                            width: '100%',
                                            minHeight: 600,
                                            height: '100%'
                                        }}
                                        config={{ responsive: true }}
                                        useResizeHandler={true}
                                    />





                                    : aggregationLevel !== 'Lecture' ?
                                        <Plot

                                            data={AuthUser === 'teacher' ?

                                                list.map((el) => {
                                                    return retrieveScatterElement(el, 'booking_counter', el.color, 'text')
                                                })
                                                :
                                                list.map((el) => {
                                                    return retrieveScatterElement(el, 'booking_counter', 'rgb(49,168,49)', 'name')
                                                })
                                                    .concat(list.map((el) => {
                                                        return retrieveScatterElement(el, 'cancellation_counter', 'black', 'name')
                                                    }))
                                                    .concat(list.map((el) => {
                                                        return retrieveScatterElement(el, 'waiting_counter', '#fcba03', 'name')
                                                    }))

                                            }

                                            layout={
                                                {
                                                    autosize: true,
                                                    title: {
                                                        text: '<b>Bookings trends</b>',
                                                        font: { size: 30 },
                                                        x: 0.5,
                                                        xanchor: 'center'
                                                    },
                                                    legend: { font: { size: 16 }, orientation: 'h', y: '-0.17' },
                                                    xaxis: {
                                                        showline: true,
                                                        tickfont: { size: 16 },
                                                        titlefont: {
                                                            size: 18,
                                                            color: 'grey'
                                                        },
                                                    },
                                                    yaxis: {
                                                        showline: true,
                                                        title: {
                                                            text: '% bookings/total number of seats',
                                                            standoff: 60
                                                        },
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
            </Col>
        </Row>
    );
}



function retrieveBarElement(list, aggregationLevel, param, type) {
    return (
        {
            y: list.map(el => (el[param] / el.num_lectures).toFixed(1)),
            x: list.map(el => el.course).map(text => {
                let rxp = new RegExp('.{1,10} ', 'g')
                return text.replace(rxp, "$&<br>")
            }),
            name: aggregationLevel === 'Lecture' ? type : (type + '(avg)'),
            marker: { color: param === 'tot_bookings' ? 'rgb(49,168,49)' : param === 'tot_cancellations' ? 'black' : param === 'tot_waiting' ? '#fcba03' : '#007BFF' },
            width: list.length === 1 ? 0.25 : 0.7,
            type: 'bar',
            hoverinfo: list.map((el => (el[param] / el.num_lectures) !== 0 ? 'y+text+name' : 'skip'))
        }
    )
}



function retrieveScatterElement(el, param, color, textChoose) {
    return (
        {
            x: el.lectures.map((lecture) => { return lecture.date }),
            y: el.lectures.map((lecture) => { return (lecture[param] / lecture.students) }),
            mode: 'lines+markers',
            type: 'scatter',
            line: { color: color, width: 2.5 },
            marker: { color: color },
            text: el.lectures.map((lecture) => { return (lecture[param] + ' Booked <br>' + (lecture[param] * 100 / lecture.students).toFixed(0) + '% of seats') }),
            name: el.course,
            hoverinfo: textChoose
        }
    )
}

export default GraphView;