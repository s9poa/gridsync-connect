import styles from "./header.module.css";
import { Link } from "react-router-dom";

function Header ({title}) {
    return (
        <header className={styles.header}>
            <h1>{title}</h1>
            <div>
                <Link to="/">Subscribe too GridSync+</Link>
                <button className={styles["mobile-menu"]} aria-label="Open menu"><i className="fa-solid fa-bars" aria-hidden="true"></i></button>
                <div className={styles["mobile-menu-dialog"]}>
                </div>
            </div>
        </header>
    )
}

export default Header;