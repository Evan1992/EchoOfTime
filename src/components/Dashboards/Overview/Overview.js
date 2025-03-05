import React from 'react';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

const Overview = () => {
    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={1} />
                    <Col>
                        <h4>Overview</h4>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default Overview
