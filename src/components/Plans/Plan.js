import React, { useState } from 'react';

/* ========== import react components ========== */
import NewPlanForm from './NewPlan/NewPlanForm'

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

/* ========== import css ========== */
import classes from './Plan.module.css'

const Plan = (props) => {
    const [showForm, setShowForm] = useState(false);

    const formToggleHandler = () => {
        setShowForm(showForm => !showForm);
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
                                props.show_plan ?
                                <img className={classes.expand_collapse_img} src='https://img.icons8.com/ios-filled/50/000000/collapse-arrow.png'  alt='collapse' /> :
                                <img className={classes.expand_collapse_img} src='https://img.icons8.com/material-rounded/24/000000/more-than.png' alt='expand' />
                            )
                        }
                    </div>
                </Col>

                <Col xs={{ span: 4}} style={{display:'flex', justifyContent:'left'}}>
                    <div style={{'textIndent':`calc(${props.plan_rank} * 20px)`}}>{props.plan_title || 'No title'}</div>
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <div className={classes.plan_add_button} onClick={formToggleHandler}>+</div>
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
                                    rank={props.plan_rank+1}
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