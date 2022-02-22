import React from 'react';

/* ========== import React components ========== */
import Plan from './Plan'
import NewPlan from './NewPlan/NewPlan'

/* ========== import other libraries ========== */
import Container from 'react-bootstrap/Container';

/* ========== import css ========== */
import 'bootstrap/dist/css/bootstrap.min.css';

const Plans = () => {
    return (
        <React.Fragment>
            <Container>
                <Plan />
                <NewPlan />
            </Container>
        </React.Fragment>
    )
}

export default Plans