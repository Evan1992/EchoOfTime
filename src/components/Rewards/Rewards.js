/* ========== import other libraries ========== */
import Container from 'react-bootstrap/Container';

/* ========== import css ========== */
import classes from './Rewards.module.css';

const Rewards = () => {
    return (
        <Container>
            <div className={classes.rewards_container}>
                <h3>Rewards</h3>
            </div>
        </Container>
    )
}

export default Rewards;