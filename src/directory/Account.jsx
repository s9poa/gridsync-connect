import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../css/account.module.css';
import Header from "../components/Header";
import UsernameForm from '../components/UsernameForm';
import PasswordForm from "../components/PasswordForm";
import ProfilePictureForm from "../components/ProfilePictureForm";
import { signOut, getUserWithProfile, updateUser, getAccountCreatedAt } from "../utils/auth";

function Account({ user, setUser }) {
    const [showUsernameForm, setShowUsernameForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showProfilePicForm, setShowProfilePicForm] = useState(false);
    const [accountCreatedAt, setAccountCreatedAt] = useState(null);
    const [timeNow, setTimeNow] = useState(Date.now());

    const usernameFormTriggerRef = useRef();
    const passwordFormTriggerRef = useRef();
    const profilePicFormTriggerRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCreationDate = async () => {
            const userData = await getUserWithProfile();
            if (userData) {
                setUser(userData);
                const { created_at } = await getAccountCreatedAt();
                setAccountCreatedAt(new Date(created_at));
            }
        };

        fetchCreationDate();
        const interval = setInterval(() => setTimeNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
    const isAnyFormOpen = showUsernameForm || showPasswordForm || showProfilePicForm;
    document.body.style.overflow = isAnyFormOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
    }, [showUsernameForm, showPasswordForm, showProfilePicForm]);


    const handleLogout = async () => {
        await signOut();
        setUser(null);
        navigate("/");
    };

    const titles = [
        { name: "Newbie", unlockAfter: 0 },
        { name: "Rising Syncer", unlockAfter: 1000 },
        { name: "Grid Explorer", unlockAfter: 2000 },
        { name: "Veteran Linker", unlockAfter: 86400 },
        { name: "Sync Master", unlockAfter: 604800 }
    ];

    const handleEquipTitle = async (title) => {
        if (user.title === title) return;

        const result = await updateUser({ title });
        if (result.success) {
            const updated = await getUserWithProfile();
            if (updated) setUser(updated);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const getRemainingTime = (unlockAfter) => {
        if (!accountCreatedAt) return null;
        const elapsed = (timeNow - accountCreatedAt.getTime()) / 1000;
        const remaining = Math.max(0, unlockAfter - elapsed);
        if (remaining <= 0) return null;

        if (remaining >= 86400) {
            const days = Math.ceil(remaining / 86400);
            return `${days} day${days > 1 ? 's' : ''}`;
        }

        const hrs = Math.floor(remaining / 3600);
        const mins = Math.floor((remaining % 3600) / 60);
        const secs = Math.floor(remaining % 60);
        return `${hrs}h ${mins}m ${secs}s`;
    };

    return (
        <main>
            <Header title="Profile" />
            <div className={styles.banner}>
                <h2>Account Details</h2>
                <div className={styles.top}>
                    <button ref={profilePicFormTriggerRef} className={styles["edit-profile-picture"]} onClick={() => setShowProfilePicForm(true)}>
                        <img src={user?.profile_picture || "/placeholder.webp"} alt="profile image" width="150" height="150" />
                    </button>
                    <div>
                        <h2 className={styles.username}>{user?.username}</h2>
                        <p className={styles["account-title"]}>Title | <span>{user?.title}</span></p>
                        {accountCreatedAt && (
                            <span className={styles["account-created"]}>
                                <i className="fa-solid fa-cake-candles" aria-hidden="true"></i>Account created: {formatDate(accountCreatedAt)}
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles.bottom}>
                    <button ref={usernameFormTriggerRef} className={styles["edit-username"]} onClick={() => setShowUsernameForm(true)}>Change Username</button>
                    <button ref={passwordFormTriggerRef} className={styles["edit-username"]} onClick={() => setShowPasswordForm(true)}>Change Password</button>
                    <button className={styles["log-out"]} onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket fa-rotate-180" aria-hidden="true"></i> Log out
                    </button>
                </div>
            </div>

            <div className={styles.achievements}>
                <h2>Achievements</h2>
                <div className={styles.grid}>
                    {titles.map(({ name, unlockAfter }) => {
                        const remaining = getRemainingTime(unlockAfter);
                        const unlocked = remaining === null;
                        const isActive = user?.title === name;

                        return (
                            <button
                                key={name}
                                className={`${styles.item} ${isActive ? styles.active : ""}`}
                                disabled={!unlocked}
                                onClick={() => unlocked && handleEquipTitle(name)}
                            >
                                <span className={styles["how-to-obtain"]}>
                                    ({unlockAfter === 0
                                        ? "Given by default when an account is created"
                                        : `Unlocked after ${unlockAfter >= 86400
                                            ? `${Math.floor(unlockAfter / 86400)} day${Math.floor(unlockAfter / 86400) > 1 ? 's' : ''}`
                                            : `${Math.floor(unlockAfter / 60)} minute${Math.floor(unlockAfter / 60) > 1 ? 's' : ''}`}`})
                                </span>
                                {unlocked ? (
                                    <span className={styles["unlocked-status"]}>
                                        {isActive ? "Currently Active" : "Already Unlocked"}
                                    </span>
                                ) : (
                                    <span className={styles["locked-status"]}>
                                        Unlock The Title In: <span className={styles["remaining-time"]}>{remaining}</span>
                                    </span>
                                )}
                                <span className={styles["unlockable-title"]}>{name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {showUsernameForm && <UsernameForm user={user} setUser={setUser} onClose={() => setShowUsernameForm(false)} formTriggerRef={usernameFormTriggerRef} />}
            {showPasswordForm && <PasswordForm onClose={() => setShowPasswordForm(false)} formTriggerRef={passwordFormTriggerRef} />}
            {showProfilePicForm && <ProfilePictureForm setUser={setUser} onClose={() => setShowProfilePicForm(false)} formTriggerRef={profilePicFormTriggerRef} />}
        </main>
    );
}

export default Account;
