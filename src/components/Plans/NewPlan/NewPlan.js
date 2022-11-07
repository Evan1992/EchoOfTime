/* ========== import React and React hooks ========== */
import React, { useState } from 'react'

/* ========== import react components ========== */
import NewPlanForm from './NewPlanForm'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/* ========== import corresponding css ========== */
import classes from './NewPlan.module.css'

const NewPlan = () => {
    const [showForm, setShowForm] = useState(false);
    const showPlan = true;

    const formToggleHandler = () => {
        setShowForm(!showForm);
    }

    return (
        <Container fluid>
            <Row>
                { !showForm && 
                    <Col xs={{ span: 3}} style={{display:'flex', justifyContent:'left'}}>
                        <div className={classes.hint} onClick={formToggleHandler}>Click here to add a task</div>
                    </Col>
                }

                { showForm &&
                    <Col xs={{ span: 5}} style={{display:'flex', justifyContent:'left'}}>
                        <NewPlanForm
                            // Here, plan is root plan and show_plan is set to true by default
                            show_plan={showPlan}
                            form_toggler={formToggleHandler}
                        />
                    </Col>
                }
            </Row>
        </Container>
    )
}

export default NewPlan