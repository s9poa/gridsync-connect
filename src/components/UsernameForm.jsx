import { useEffect, useRef, useState } from "react";
import { updateUser, getUserWithProfile } from "../utils/auth"; // adjust import if needed
import styles from "./username-form.module.css";

function UsernameForm({ user, setUser, onClose }) {
    const formRef = useRef(null);
    const [newUsername, setNewUsername] = useState("");

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
        const result = await updateUser({ username: newUsername });
        if (result.error) {
            alert("Failed to update username: " + result.error.message);
        } else {
            const updated = await getUserWithProfile();
            if (updated) setUser(updated);
            onClose();
        }
    };

    return (
        <div className={styles["form-blur"]} onClick={handleFormClick} ref={formRef}>
            <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Username</h2>
                    <button type="button" className={styles["close-form"]} onClick={onClose} aria-label="Close username form"><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
                </div>
                <div className={styles["form-divider"]}>
                    <span></span>
                    <span className={styles.label}>Grid<span>Sync</span></span>
                    <span></span>
                </div>
                <div className={styles["input-grouping"]}>
                    <label htmlFor="change-username">Username</label>
                    <input type="text" id="change-username" placeholder="Enter your new username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                </div>
                <p>Current username: <span className={styles["current-username"]}>{user?.username}</span></p>
                <button className={styles["form-submission"]}>Update</button>
            </form>
        </div>
    );
}

export default UsernameForm;
