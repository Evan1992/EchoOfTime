import React from 'react';

/* ========== import other libraries ========== */
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/* ========== import css ========== */
import classes from './Plan.module.css'


const Plan = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <div className={classes.expand_collapse} >
                        {/* <img className={classes.expand_collapse_img} src='https://img.icons8.com/material-rounded/24/000000/more-than.png' alt='expand' /> */}
                        {/* <img className={classes.expand_collapse_img} src='https://img.icons8.com/ios-filled/50/000000/collapse-arrow.png'  alt='collapse' /> */}
                    </div>
                </Col>

                <Col>
                    <div>{props.plan_title}</div>
                </Col>
            </Row>

        </React.Fragment>
    )
}

export default Plan;