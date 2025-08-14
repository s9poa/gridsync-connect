import styles from "../../css/preloader-css/preloader.module.css";

function Preloader({ fadeOut }) {
    return (
        <div className={`${styles.preloader} ${fadeOut ? styles.fadeOut : ""}`}>
            <div className={`${styles["preloader-dot"]} ${styles.one}`}></div>
            <div className={`${styles["preloader-dot"]} ${styles.two}`}></div>
            <div className={`${styles["preloader-dot"]} ${styles.three}`}></div>
            <div className={`${styles["preloader-dot"]} ${styles.four}`}></div>
            <div className={`${styles["preloader-dot"]} ${styles.five}`}></div>
        </div>
    );
}

export default Preloader;
