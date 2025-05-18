import styles from "./left-sidebar.module.css";

import { Link } from "react-router";

function LeftSidebar () {
    return (
        <aside className={styles.aside}>
            <Link to="/" className={styles.logo}>Grid<span>Sync</span></Link>
            <div className={styles["beta-divider"]}>
                <span class={styles.divider}></span>
                <span>Beta</span>
                <span class={styles.divider}></span>
            </div>
        </aside>
    )
}

export default LeftSidebar;