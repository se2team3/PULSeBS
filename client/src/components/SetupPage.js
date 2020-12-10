import React, { useState, useEffect, useMemo } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

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
    } = useDropzone({ accept: 'text/csv,text/plain', maxFiles: 1, onDropAccepted: props.onDropAccepted, onDropRejected: props.onDropRejected, disabled: props.disabled });

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

    const upload_steps = ['Students', 'Teachers', 'Courses', 'Enrollment', 'Schedule']

    const [preview, setPreview] = useState([undefined, undefined, undefined, undefined, undefined]);
    const [stepDisabled, setStepDisabled] = useState([false, true, true, true, true]);
    const [stepFiles, setStepFiles] = useState([undefined, undefined, undefined, undefined, undefined]);

    /*useEffect(() => {
        getLecture(props.lecture_id);
        API.getBookings(props.lecture_id)
            .then((b) => {
                setBookings(b);
            }).catch((e) => { setState(() => { throw e; }) })
    }, [props.lecture_id]);*/

    const parseFileForStep = (stepNumber, acceptedFile) => {
        Papa.parse(acceptedFile[0], {
            preview: 6, complete: function (results, file) {
                console.log("Parsing complete:", results, file);
                const previewList = [];
                const filesList = [];
                
                for (let i = 0; i <= stepNumber; i++) {
                    if (i === stepNumber){
                        previewList[i] = results;
                        filesList[i] = acceptedFile[0];
                    }
                    else{
                        previewList[i] = preview[i];
                        filesList[i] = stepFiles[i];
                    }
                }
                const disabledSteps = [];
                for (let i = 0; i < upload_steps.length; i++) {
                    if(i === stepNumber + 1) disabledSteps[i] = false;
                    else disabledSteps[i] = stepDisabled[i];
                }
                
                setStepFiles(filesList);
                setPreview(previewList);
                setStepDisabled(disabledSteps);
            }
        });
    }

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
                <Row style={{ paddingTop: "10px" }}>
                    <Col>
                        <p>
                            This page will guide you through the setup of the PULSeBS server, complete the following steps one after the other.
                        </p>
                    </Col>
                </Row>
                {upload_steps.map((step, stepNumber) => {
                    return <Row>
                        <Col md={12}><h3>{step}</h3></Col>
                        <Col md={4}>

                            <p>Upload a .csv file containing Id, Name, Surname, City, OfficialEmail, Birthday and SSN for each student</p>
                        </Col>
                        <Col md={8}>
                            <StyledDropzone onDropAccepted={(accFiles) => parseFileForStep(stepNumber, accFiles)} disabled={stepDisabled[stepNumber]} />
                        </Col>
                        {!!preview[stepNumber] && <Col md={12}>
                            <Table>
                                <thead>
                                    {preview[stepNumber].data[0].map((el) => <th>{el}</th>)}
                                </thead>
                                <tbody>
                                    {preview[stepNumber].data.map((row, index) => {
                                        if (index === 0)
                                            return undefined;
                                        return <tr>{row.map((cell) => <td>{cell}</td>)}</tr>
                                    })}
                                </tbody>
                            </Table>
                        </Col>}
                    </Row>
                })}
            </Container>
        </Row>

    </>)

}

export default SetupPage