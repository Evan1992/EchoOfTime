import MainNavigation from './MainNavigation'
import Footer from './Footer'

/* ========== import css ========== */
import classes from './Layout.module.css'

const Layout = (props) => {
    return (
        <div className={classes.layout}>
            <MainNavigation />
            <main className={classes.main_content}>{props.children}</main>
            <Footer />
        </div>
    );
};

export default Layout;