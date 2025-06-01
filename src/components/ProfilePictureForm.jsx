import { useEffect, useRef, useState } from "react";
import { updateProfilePicture, getUserWithProfile } from "../utils/auth";
import styles from "./profile-picture-form.module.css";

import SuccessFormMessage from "../components/SuccessFormMessage";
import ErrorFormMessage from "../components/ErrorFormMessage";

function ProfilePictureForm({ setUser, onClose }) {
    const formRef = useRef(null);
    const [selected, setSelected] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const profileImages = [
        "/profile-picture-1.webp",
        "/profile-picture-2.webp",
        "/profile-picture-3.webp",
        "/profile-picture-4.webp",
        "/profile-picture-5.avif"
    ];

    useEffect(() => {
        if (!formRef.current) return;

        const focusable = formRef.current.querySelectorAll("button, input, a");
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
        if (!selected) {
            setShowError(true);
            return;
        }

        const result = await updateProfilePicture(selected);
        if (result.error) {
            setShowError(true);
        } else {
            const updated = await getUserWithProfile();
            if (updated) setUser(updated);
            setShowSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        }
    };

    return (
        <div className={styles["form-blur"]} onClick={handleFormClick} ref={formRef}>
            <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Profile Image</h2>
                    <button type="button" className={styles["close-form"]} onClick={onClose} aria-label="Close profile image form">
                        <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                </div>
                <div className={styles["form-divider"]}>
                    <span></span>
                    <span className={styles.label}>Grid<span>Sync</span></span>
                    <span></span>
                </div>
                <div className={styles["grid"]}>
                    {profileImages.map(img => (
                        <button
                            type="button"
                            key={img}
                            onClick={() => setSelected(img)}
                            className={selected === img ? styles["selected"] : ""}
                        >
                            <img src={img} alt="Profile option" width="150" height="150" />
                        </button>
                    ))}
                </div>
                {showSuccess && <SuccessFormMessage des="Your profile picture has been updated successfully." />}
                {showError && <ErrorFormMessage des="Profile picture update failed. Please try again." />}
                <button className={styles["form-submission"]}>Update</button>
            </form>
        </div>
    );
}

export default ProfilePictureForm;
