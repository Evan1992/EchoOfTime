/* ========== import React and React hooks ========== */
import React, { useState } from 'react'

/* ========== import react components ========== */
import NewPlanForm from './NewPlanForm'
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/* ========== import corresponding css ========== */
import classes from './NewPlan.module.css'

const NewPlan = (props) => {
    const [showForm, setShowForm] = useState(false);
    const showPlan = true;

    const formToggleHandler = () => {
        setShowForm(!showForm);
    }

    return (
        <React.Fragment>
            <Row>
                {/* The two Cols are placeholders to make the NewPlan align with Plan above */}
                <Col xs={1} />
                <Col xs='auto' >
                    <div className={classes.expand_collapse}></div>
                </Col>

                { !showForm && 
                    <Col xs={{ span: 4}} style={{display:'flex', justifyContent:'left'}}>
                        <div className={classes.hint} onClick={formToggleHandler}>Click here to add a task</div>
                    </Col>
                }

                { showForm &&
                    <Col xs={{ span: 5}} style={{display:'flex', justifyContent:'left'}}>
                        <NewPlanForm
                            // Here, plan is root plan and show_plan is set to true by default
                            long_term_plan_id={props.long_term_plan_id}
                            short_term_plan_id={props.short_term_plan_id}
                            show_plan={showPlan}
                            form_toggler={formToggleHandler}
                        />
                    </Col>
                }
            </Row>
        </React.Fragment>
    )
}

export default NewPlan