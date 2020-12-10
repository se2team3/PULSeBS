import React, { useState, useEffect, useMemo } from 'react';
import { Alert, Button, Col, Container, Row, Table } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
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
        <div className="container" style={{ padding: 0 }}>
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

    const upload_steps = ['Students', 'Teachers', 'Courses', 'Enrollment', 'Schedule'];
    const expected_columns = [
        ["Id", "Name", "Surname", "City", "OfficialEmail", "Birthday", "SSN"],
        ["Number", "GivenName", "Surname", "OfficialEmail", "SSN"],
        ["Code", "Year", "Semester", "Course", "Teacher"],
        ["Code", "Student"],
        ["Code", "Room", "Day", "Seats", "Time"]
    ];

    const [parsedData, setParsedData] = useState([undefined, undefined, undefined, undefined, undefined]);
    const [stepDisabled, setStepDisabled] = useState([false, true, true, true, true]);
    const [stepErrors, setStepErrors] = useState([false, false, false, false, false]);

    /*useEffect(() => {
        getLecture(props.lecture_id);
        API.getBookings(props.lecture_id)
            .then((b) => {
                setBookings(b);
            }).catch((e) => { setState(() => { throw e; }) })
    }, [props.lecture_id]);*/

    const parseFileForStep = (stepNumber, acceptedFile) => {
        Papa.parse(acceptedFile[0], {
            header: true,
            complete: function (results, file) {
                console.log("Parsing complete:", results, file);
                const previewList = [];

                if(JSON.stringify(results.meta.fields)===JSON.stringify(expected_columns[stepNumber])){
                    for (let i = 0; i <= stepNumber; i++) {
                        if (i === stepNumber) {
                            previewList[i] = results;
                        }
                        else {
                            previewList[i] = parsedData[i];
                        }
                    }
                    const disabledSteps = [];
                    for (let i = 0; i < upload_steps.length; i++) {
                        if (i === stepNumber + 1) disabledSteps[i] = false;
                        else disabledSteps[i] = stepDisabled[i];
                    }
                    const newStepErrors = [];
                    for (let i = 0; i < upload_steps.length; i++) {
                        if (i === stepNumber) newStepErrors[i] = false;
                        else newStepErrors[i] = stepErrors[i];
                    }
                    console.log(newStepErrors);
                    setStepErrors(newStepErrors);
                    setParsedData(previewList);
                    setStepDisabled(disabledSteps);
                }
                else{
                    const newStepErrors = [];
                    for (let i = 0; i < upload_steps.length; i++) {
                        if (i === stepNumber) newStepErrors[i] = "Attributes names or number of attributes does not match the requirements for this step.";
                        else newStepErrors[i] = stepErrors[i];
                    }
                    console.log(newStepErrors);
                    setStepErrors(newStepErrors);
                }
            }
        });
    }

    const handleSubmit = () => {
        console.log(parsedData);
        if(parsedData.length===upload_steps.length&&stepErrors.every((step)=>step===false)){
            console.log("All good");//TODO: some more checks are required
            const postBody = {};
            postBody['students']=parsedData[0].data;
            postBody['teachers']=parsedData[1].data;
            postBody['courses']=parsedData[2].data;
            postBody['enrollment']=parsedData[3].data;
            postBody['schedule']=parsedData[4].data;
            console.log(postBody);
        }  
        else
            console.log("Something went wrong");
        
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
                        <Alert variant={"warning"}>
                            Complete a step to enable the next one. On "Submit all" the data previously present in the database will be deleted and the new data will be inserted.
                        </Alert>
                    </Col>
                </Row>
                {upload_steps.map((step, stepNumber) => {
                    return <SetupStep 
                        stepName={step}
                        stepNumber={stepNumber}
                        disabled={stepDisabled[stepNumber]}
                        expectedColumns={expected_columns[stepNumber]}
                        parseFile={(accFiles) => parseFileForStep(stepNumber, accFiles)}
                        parsedData={parsedData[stepNumber]}
                        stepError={stepErrors[stepNumber]}
                    />
                })}
                <Row>
                    <Col style={{textAlign: 'right', paddingBottom: "30px"}}>
                        <Button variant="success" size="lg" onClick={handleSubmit} disabled={parsedData.length<upload_steps.length&&!stepErrors.every((step)=>step===false)}>
                            Submit all
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Row>

    </>)

}

function SetupStep(props){
    return <Row>
        <Col md={4} style={props.disabled ? { color: "#ccc" } : {}}>
            <h3>{props.stepName}</h3>
            <p>Upload a .csv file containing columns {props.expectedColumns.map((column_name, ind) => {
                if (ind === props.expectedColumns.length - 1) return column_name + ".";
                else return column_name + ", ";
            })}</p>
        </Col>
        <Col md={8} style={{ paddingTop: "10px" }}>
            <StyledDropzone onDropAccepted={props.parseFile} disabled={props.disabled} />
        </Col>
        {props.stepError && <Col md={12}>
            <Alert variant={"danger"} style={{marginTop: "10px"}}>
                {props.stepError}
            </Alert>
        </Col>}
        {!!props.parsedData && <Col md={12} style={{ marginTop: "10px" }}>
            <Table striped bordered responsive>
                <thead>
                    <tr>
                        {props.parsedData.meta.fields.map((el) => <th>{el}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {props.parsedData.data.slice(0, Math.min(5, props.parsedData.data.length)).map((row) =>
                        <tr>{Object.values(row).map((cell) => <td>{cell}</td>)}</tr>
                    )}
                </tbody>
            </Table>
            <p style={{textAlign: "center"}}>Showing {Math.min(5, props.parsedData.data.length)} of {props.parsedData.data.length} rows.</p>
        </Col>}
    </Row>
}

export default SetupPage