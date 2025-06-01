import { useEffect, useRef, useState } from "react";
import { updatePassword } from "../utils/auth";
import styles from "./password-form.module.css";

import SuccessFormMessage from "../components/SuccessFormMessage";
import ErrorFormMessage from "../components/ErrorFormMessage";

function PasswordForm({ onClose }) {
    const formRef = useRef(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (!formRef.current) return;

        const container = formRef.current;
        const focusable = container.querySelectorAll("button, input, a");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        first?.focus();

        const trapFocus = e => {
            if (e.key === "Tab") {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", trapFocus);
        return () => document.removeEventListener("keydown", trapFocus);
    }, [onClose]);

    const handleFormClick = e => {
        if (e.target.classList.contains(styles["form-blur"])) onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowError(false);
        setShowSuccess(false);

        if (newPassword !== confirmPassword) {
            setShowError(true);
            return;
        }

        const result = await updatePassword(newPassword);
        if (result.error) {
            setShowError(true);
        } else {
            setShowSuccess(true);
            setTimeout(() => onClose(), 2000);
        }
    };

    return (
        <div className={styles["form-blur"]} onClick={handleFormClick} ref={formRef}>
            <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Password</h2>
                    <button type="button" className={styles["close-form"]} onClick={onClose} aria-label="Close password form">
                        <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                </div>
                <div className={styles["form-divider"]}>
                    <span></span>
                    <span className={styles.label}>Grid<span>Sync</span></span>
                    <span></span>
                </div>
                <div className={styles["input-grouping"]}>
                    <label htmlFor="change-password">Password</label>
                    <input type="password" id="change-password" placeholder="Enter your new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <div className={styles["input-grouping"]}>
                    <label htmlFor="confirm-change-password">Re-type Password</label>
                    <input type="password" id="confirm-change-password" placeholder="Confirm your new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>

                {showSuccess && <SuccessFormMessage des="Your password has been updated successfully." />}
                {showError && <ErrorFormMessage des="Password update failed. Please try again." />}

                <button className={styles["form-submission"]}>Update</button>
            </form>
        </div>
    );
}

export default PasswordForm;
