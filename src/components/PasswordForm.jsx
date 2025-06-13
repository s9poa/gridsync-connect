import { useEffect, useRef, useState } from "react";
import { updatePassword } from "../utils/auth";
import styles from "./password-form.module.css";

import SuccessFormMessage from "../components/SuccessFormMessage";
import ErrorFormMessage from "../components/ErrorFormMessage";

function PasswordForm({ onClose, formTriggerRef }) {
    const formRef = useRef(null);
    const hasFocused = useRef(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (!formRef.current || hasFocused.current) return;

        const form = formRef.current;
        const focusable = form.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        first?.focus();
        hasFocused.current = true;

        const trapFocus = e => {
            if (e.key === "Tab") {
                if (focusable.length === 0) return;
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            } else if (e.key === "Escape") {
                e.preventDefault();
                handleClose();
            }
        };

        const handleOutsideClick = e => {
            if (!form.contains(e.target)) {
                handleClose();
            }
        };

        document.addEventListener("keydown", trapFocus);
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("keydown", trapFocus);
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleClose = () => {
        onClose();
        formTriggerRef?.current?.focus();
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
            setTimeout(() => handleClose(), 2000);
        }
    };

    return (
        <div className={styles["form-blur"]}>
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <h2>Password</h2>
                    <button type="button" className={styles["close-form"]} onClick={handleClose} aria-label="Close password form">
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
