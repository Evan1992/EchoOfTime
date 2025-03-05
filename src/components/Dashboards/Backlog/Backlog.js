import React from 'react';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/esm/Container';

const Backlog = () => {
    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col xs={1} />
                    <Col>
                        <h4>Backlog</h4>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default Backlog
