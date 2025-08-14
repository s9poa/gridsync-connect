import styles from "../../css/components-css/form-css/form-message.module.css";

function ErrorFormMessage ({des}) {
    return (
        <div className={`${styles["form-message"]} ${styles["error"]}`}>
            <p>{des}</p>
        </div>
    )
}

export default ErrorFormMessage;