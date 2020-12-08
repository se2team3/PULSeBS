import React, { useState, useEffect, useMemo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

function StyledDropzone(props) {
    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({ accept: 'text/csv,text/plain', maxFiles: 1 });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const files = acceptedFiles.map(file => (
        <p key={file.path}>
          {file.path} - {file.size} bytes
        </p>
      ));

    return (
        <div className="container">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop the .csv file here, or click to browse and select the file</p>
                {files}
            </div>
        </div>
    );
}



function SetupPage(props) {

    const [/* state */, setState] = useState();

    /*useEffect(() => {
        getLecture(props.lecture_id);
        API.getBookings(props.lecture_id)
            .then((b) => {
                setBookings(b);
            }).catch((e) => { setState(() => { throw e; }) })
    }, [props.lecture_id]);*/

    return (<>
        <Row style={{ background: "#eee" }}>
            <Container>
                <Row style={{ paddingTop: "50px", paddingBottom: "10px" }}>
                    <Col>
                        <h1>Setup</h1>
                    </Col>
                </Row>
            </Container>
        </Row>
        <Row style={{ background: "#fff" }}>
            <Container>
                <Row style={{paddingTop: "10px"}}>
                    <Col>
                        <p>
                            This page will guide you through the setup of the PULSeBS server, complete the following steps one after the other.
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}><h3>Students</h3></Col>
                    <Col md={4}>
                        
                        <p>Upload a .csv file containing Id, Name, Surname, City, OfficialEmail, Birthday and SSN for each student</p>
                    </Col>
                    <Col md={8}>
                        <StyledDropzone />
                    </Col>
                </Row>
            </Container>
        </Row>

    </>)

}

export default SetupPage