import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

/* ========== import React components ========== */
import NewDailyPlanForm from './NewDailyPlanForm';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { activePlanActions } from '../../../store/slices/active-plan-slice';
import { sendDailyPlanData } from '../../../store/slices/active-plan-actions';

/* ========== import css ========== */
import classes from './DailyPlan.module.css';


const DailyPlan = (props) => {
    const [dailyPlanChanged, setDailyPlanChanged] = useState(false);
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if(dailyPlanChanged === true) {
            dispatch(sendDailyPlanData(props.plan))
            setDailyPlanChanged(false);
        }
    }, [dispatch, props.plan, dailyPlanChanged])

    const formToggleHandler = () => {
        setShowForm(!showForm);
    }

    const childrenToggleHandler = () => {
        if(props.show_children) {
            dispatch(
                activePlanActions.hideChildPlan({
                    id:props.id,
                    index:props.index
                })
            )
        } else {
            dispatch(
                activePlanActions.showChildPlan({
                    id:props.id,
                    index:props.index
                })
            );
        }
    }

    const expectedHoursChangeHandler = (event) => {
        dispatch(
            activePlanActions.setExpectedHours({
                index:props.index,
                hours:event.target.value
            })
        )
        setDailyPlanChanged(true);
    }

    const expectedMinutesChangeHandler = (event) => {
        dispatch(
            activePlanActions.setExpectedMinutes({
                index:props.index,
                minutes:event.target.value
            })
        )
        setDailyPlanChanged(true);
    }

    return (
        <React.Fragment>
            <Row>
                <Col xs={1} />
                <Col xs='auto'>
                    <div className={classes.expand_collapse} onClick={childrenToggleHandler} >
                        {/* Ternary expression: render the icon conditionally based on the state show_children using ternary operator */}
                        {
                            // do not show the expand/shrink icon if no children
                            (props.daily_plan.has_children) &&
                            (
                                props.show_children ?
                                <img className={classes.expand_collapse_img} src='https://img.icons8.com/ios-filled/50/000000/collapse-arrow.png'  alt='collapse' /> :
                                <img className={classes.expand_collapse_img} src='https://img.icons8.com/material-rounded/24/000000/more-than.png' alt='expand' />
                            )
                        }
                    </div>
                </Col>

                <Col xs={{ span: 4}} style={{display:'flex', justifyContent:'left'}}>
                    <div style={{'textIndent':`calc(${props.daily_plan.rank} * 20px)`}}>{props.daily_plan.title || 'No title'}</div>
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <div className={classes.plan_add_button} onClick={formToggleHandler}>+</div>
                </Col>

                <Col xs="auto" style={{padding: 0}}>
                    <div>
                        <input className={classes.input_time} type="number" onChange={expectedHoursChangeHandler} value={props.daily_plan.expected_hours} />:
                        <input className={classes.input_time} type="number" onChange={expectedMinutesChangeHandler} value={props.daily_plan.expected_minutes} />
                    </div>
                </Col>
            </Row>

            <Row>
                {
                    showForm &&
                    <Container fluid>
                        <Row>
                            <Col xs={1}></Col>
                            <Col xs={{ span: 5}} style={{display:'flex', justifyContent:'left'}}>
                                <NewDailyPlanForm
                                    parent_id={props.id}
                                    rank={props.rank+1}
                                    index={props.index} // used to decide where to insert the new daily plan to daily_plans
                                    formToggler={formToggleHandler}
                                />
                            </Col>
                        </Row>
                    </Container>
                }
            </Row>
        </React.Fragment>
    )
}

export default DailyPlan;