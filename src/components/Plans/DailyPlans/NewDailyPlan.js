import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* ========== import other libraries ========== */
import { sendDailyPlanData } from '../../../store/slices/active-plan-actions';

/* ========== import React components ========== */
import NewDailyPlanForm from './NewDailyPlanForm';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AuthContext from '../../../store/auth-context';

/* ========== import css ========== */
import classes from './NewDailyPlan.module.css';

const NewDailyPlan = (props) => {
    const dispatch = useDispatch();
    const authCtx = useContext(AuthContext);
    const plan = useSelector((state) => state.activePlan);
    const [showForm, setShowForm] = useState(false);
    const [isAddNewPlan, setIsAddNewPlan] = useState(false);

    useEffect(() => {
        if(isAddNewPlan) {
            dispatch(sendDailyPlanData(authCtx.userID, plan));
            setIsAddNewPlan(false);
        }
    }, [dispatch, authCtx.userID, plan, isAddNewPlan])

    const formToggleHandler = () => {
        setShowForm(!showForm);
    }

    return (
        <React.Fragment>
            <Row>
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
                            rank={0}
                            date={props.date}
                            formToggler={formToggleHandler}
                            setIsAddNewPlan={setIsAddNewPlan}
                        />
                    </Col>
                }
            </Row>
        </React.Fragment>
    )
}

export default NewDailyPlan;