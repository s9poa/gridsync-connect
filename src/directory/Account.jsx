import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../css/account.module.css';
import Header from "../components/Header";
import UsernameForm from '../components/UsernameForm';
import PasswordForm from "../components/PasswordForm";
import ProfilePictureForm from "../components/ProfilePictureForm";
import { signOut } from "../utils/auth";

function Account({ user, setUser }) {
    const [showUsernameForm, setShowUsernameForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showProfilePicForm, setShowProfilePicForm] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        navigate("/");
    };

    return (
        <main>
            <Header title="Profile" />
            <div className={styles.banner}>
                <div className={styles.top}>
                    <button className={styles["edit-profile-picture"]} onClick={() => setShowProfilePicForm(true)}>
                        <img src={user?.profile_picture || "/placeholder.png"} alt="profile image" width="150" height="150" />
                    </button>
                    <div>
                        <h2 className={styles.username}>{user?.username}</h2>
                        <p className={styles["account-title"]}>{user?.title}</p>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <button className={styles["edit-username"]} onClick={() => setShowUsernameForm(true)}>Change Username</button>
                    <button className={styles["edit-username"]} onClick={() => setShowPasswordForm(true)}>Change Password</button>
                    <button className={styles["log-out"]} onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket fa-rotate-180" aria-hidden="true"></i> Log out
                    </button>
                </div>
            </div>

            {showUsernameForm && (
                <UsernameForm user={user} setUser={setUser} onClose={() => setShowUsernameForm(false)} />
            )}

            {showPasswordForm && (
                <PasswordForm onClose={() => setShowPasswordForm(false)} />
            )}

            {showProfilePicForm && (
                <ProfilePictureForm setUser={setUser} onClose={() => setShowProfilePicForm(false)} />
            )}
        </main>
    );
}

export default Account;
