import problemAPI from "api/problem";
import React from "react";
import {Link} from "react-router-dom";
import {Container, Row, Col, Button} from "react-bootstrap";
import {SpinLoader} from "components";
import useSWR from "swr";

const FIRST_COL_SIZE = 2;

const typeChoice = [
  {
    value: "C",
    display_name: "Normal case (C)",
  },
  {
    value: "S",
    display_name: "Batch start (B)",
  },
  {
    value: "E",
    display_name: "Batch end (E)",
  },
];

const TestcaseEditor = ({shortName, testId, onCancel}) => {
  const {data} = useSWR(
    shortName ? ["test-details", shortName, testId] : null,
    () => problemAPI.adminGetTestcaseDetails({shortName, testId})
  );

  const [state, setState] = React.useState({});

  React.useEffect(() => {
    if (data) setState(data);
  }, [data]);

  const handleFormSubmit = e => {
    e.preventDefault();
    console.log(state);
    alert("Not implemented yet!");
  };

  return (
    <Container
      id="problem-testcase-edit-form"
      as="form"
      onSubmit={handleFormSubmit}
    >
      {!data && (
        <span>
          <SpinLoader /> Loading...
        </span>
      )}
      <div className="mb-4 text-danger">
        <Link to="#" onClick={() => onCancel()}>
          {"<< Back to test case list "}
        </Link>
        <span> | Editing testcase #{state?.order}</span>
      </div>
      <Row>
        <Col xs={FIRST_COL_SIZE}>Problem</Col>
        <Col xs>{shortName}</Col>
      </Row>
      <Row>
        <Col xs={FIRST_COL_SIZE}>Test order</Col>
        <Col xs>#{state?.order}</Col>
      </Row>
      <Row>
        <Col xs={FIRST_COL_SIZE}>Input file</Col>
        <Col xs>{state?.input_file}</Col>
      </Row>
      <Row>
        <Col xs={FIRST_COL_SIZE}>Output file</Col>
        <Col xs>{state?.output_file}</Col>
      </Row>
      <Row>
        <Col xs={FIRST_COL_SIZE}>Type</Col>
        <Col xs>
          <select
            onChange={e => setState({...state, type: e.target.value})}
            value={state?.type}
          >
            {typeChoice.map(({value, display_name}) => (
              <option key={value} value={value}>
                {display_name}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <Row>
        <Col xs={FIRST_COL_SIZE}>Points</Col>
        <Col xs>
          <input
            type="number"
            value={state?.points}
            onChange={e => {
              setState(prev => ({
                ...prev,
                points: e.target.value,
              }));
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={FIRST_COL_SIZE}>Is Pretest?</Col>
        <Col xs>
          <input
            type="checkbox"
            value={state?.is_pretest}
            onChange={e => {
              setState(prev => ({...prev, is_pretest: e.target.checked}));
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={FIRST_COL_SIZE}>Input data</Col>
        <Col xs>
          <textarea
            rows="5"
            cols="50"
            defaultValue={state?.input_partial}
            className="w-100"
          />
        </Col>
      </Row>
      <div className="d-flex">
        <Button variant="dark" size="sm" type="submit" className="mt-1 mr-2">
          Save
        </Button>
        <Button
          variant="danger"
          size="sm"
          type="button"
          className="mt-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </Container>
  );
};

export default TestcaseEditor;
