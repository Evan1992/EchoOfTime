import React, { useState } from 'react';

/* ========== import React components ========== */
import NewDailyPlanForm from './NewDailyPlanForm';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/* ========== import css ========== */
import classes from './NewDailyPlan.module.css';

const NewDailyPlan = () => {
    const [showForm, setShowForm] = useState(false);

    const formToggleHandler = () => {
        setShowForm(!showForm);
    }

    return (
        <React.Fragment>
            <Row>
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
                        <NewDailyPlanForm 
                            formToggler={formToggleHandler}
                        />
                    </Col>
                }
            </Row>
        </React.Fragment>
    )
}

export default NewDailyPlan;