import React from 'react';
import { Alert, Button, Col, Container, Jumbotron, Row, Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

function ErrorPage(props) {
    return <Container>
        <Row>
            
            <Col>
            <br></br>
                <Jumbotron>
                    <h1>Something went wrong...</h1>
                    <h3>Not found or unauthorized</h3>
                    <p>This resource does not exist or you are not authorized to access it</p>
                    <p>
                        <Button variant="primary" onClick={()=>props.history.push('/')}>Go back to the home page</Button>
                    </p>
                </Jumbotron>
            </Col>
        </Row>
    </Container>
}

export default withRouter(ErrorPage);