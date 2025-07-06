import { useEffect, useRef, useState } from "react";
import { updateUser, getUserWithProfile } from "../utils/auth";
import styles from "./username-form.module.css";

import SuccessFormMessage from "../components/SuccessFormMessage";
import ErrorFormMessage from "../components/ErrorFormMessage";

function UsernameForm({ user, setUser, onClose, formTriggerRef }) {
    const formRef = useRef(null);
    const hasFocused = useRef(false);

    const [newUsername, setNewUsername] = useState("");
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
        setShowSuccess(false);
        setShowError(false);
        const result = await updateUser({ username: newUsername });
        if (result.error) {
            setShowError(true);
        } else {
            const updated = await getUserWithProfile();
            if (updated) setUser(updated);
            setShowSuccess(true);
            setTimeout(() => {
                handleClose();
                setShowSuccess(false);
            }, 1500);
        }
    };

    return (
        <div className={styles["form-blur"]}>
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <h2>Username</h2>
                    <button type="button" className={styles["close-form"]} onClick={handleClose} aria-label="Close username form"><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
                </div>
                <div className={styles["input-grouping"]}>
                    <label htmlFor="change-username">Username</label>
                    <input type="text" id="change-username" placeholder="Enter your new username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                </div>
                {showSuccess && <SuccessFormMessage des="Your username has been updated successfully." />}
                {showError && <ErrorFormMessage des="Username update failed. Please try again." />}
                <p>Current username: <span className={styles["current-username"]}>{user?.username}</span></p>
                <button className={styles["form-submission"]}>Update</button>
            </form>
        </div>
    );
}

export default UsernameForm;
