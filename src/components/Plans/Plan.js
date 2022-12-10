import React, { useState } from 'react';

/* ========== import react components ========== */
import axios from '../../axios';
import NewPlanForm from './NewPlan/NewPlanForm'
import Timer from '../Timer/Timer';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

/* ========== import css ========== */
import classes from './Plan.module.css'

const Plan = (props) => {
    const [showForm, setShowForm] = useState(false);
    const [isClockActive, setIsClockActive] = useState(false);
    const [seconds, setSeconds] = useState(props.plan.seconds);


    const formToggleHandler = () => {
        setShowForm(showForm => !showForm);
    }

    const clockToggleHandler = () => {
        // Upload the time to database after stopping the timer
        if(isClockActive) {
            console.log("Updating the database...");
            axios.put(`/plans/${props.plan_id}/seconds.json`, seconds);
        }
        setIsClockActive(isClockActive => !isClockActive);
    }

    return (
        <React.Fragment>
            <Row>
                <Col xs={1} />
                <Col xs='auto'>
                    <div className={classes.expand_collapse} onClick={props.childrenToggleHandler} >
                        {/* Ternary expression: render the icon conditionally based on the state show_children using ternary operator */}
                        {
                            // do not show the expand/shrink icon if no children
                            (typeof props.plan.children !== 'undefined') &&
                            (
                                props.show_children ?
                                <img className={classes.expand_collapse_img} src='https://img.icons8.com/ios-filled/50/000000/collapse-arrow.png'  alt='collapse' /> :
                                <img className={classes.expand_collapse_img} src='https://img.icons8.com/material-rounded/24/000000/more-than.png' alt='expand' />
                            )
                        }
                    </div>
                </Col>

                <Col xs={{ span: 4}} style={{display:'flex', justifyContent:'left'}}>
                    <div style={{'textIndent':`calc(${props.plan.rank} * 20px)`}}>{props.plan.title || 'No title'}</div>
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <div className={classes.plan_add_button} onClick={formToggleHandler}>+</div>
                </Col>

                <Col xs={2}>
                    <Timer seconds={seconds} setSeconds={setSeconds} isClockActive={isClockActive} />
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <img className={classes.plan_clock_button} onClick={clockToggleHandler} src="https://img.icons8.com/ios-glyphs/30/000000/--pocket-watch.png" alt=''/>
                </Col>
            </Row>

            <Row>
                {
                    showForm &&
                    <Container fluid>
                        <Row>
                            <Col xs={1}></Col>
                            {/* <Col xs="auto"><div style={{width: `calc(20px + ${data.rank} * 20px)`}}></div></Col> */}
                            <Col xs={{ span: 5}} style={{display:'flex', justifyContent:'left'}}>
                                <NewPlanForm 
                                    form_toggler={formToggleHandler}
                                    parent_plan={props.plan}
                                    parent={props.plan_id}
                                    rank={props.plan.rank+1}
                                />
                            </Col>
                        </Row>
                    </Container>
                    
                }
            </Row>

        </React.Fragment>
    )
}

export default Plan;