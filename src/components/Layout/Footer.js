import classes from './Footer.module.css'

const Footer = () => {
    return(
        <div>
            <div className={classes.footer_wrapper}>
                <span className={classes.copyright}>Copyright © 2022 Echo of Time</span>
            </div>
        </div>
    )
    
}

export default Footer