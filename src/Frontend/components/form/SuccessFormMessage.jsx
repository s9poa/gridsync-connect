import styles from "../../css/components-css/form-css/form-message.module.css";

function SuccessFormMessage ({des}) {
    return (
        <div className={`${styles["form-message"]} ${styles["success"]}`}>
            <p>{des}</p>
        </div>
    )
}

export default SuccessFormMessage;