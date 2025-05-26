import { useState } from "react";
import styles from '../css/account.module.css';
import Header from "../components/Header";
import UsernameForm from '../components/UsernameForm';

function Account({ user, setUser }) {
    const [showUsernameForm, setShowUsernameForm] = useState(false);

    return (
        <main>
            <Header title="Profile" />
            <div className={styles.banner}>
                <div className={styles.top}>
                    <img src="/placeholder.png" alt="profile image" width="150" height="150" />
                    <div>
                        <h2 className={styles.username}>{user?.username}</h2>
                        <p className={styles["account-title"]}>{user?.title}</p>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <button className={styles["edit-username"]} onClick={() => setShowUsernameForm(true)}>Change Username</button>
                    <button className={styles["edit-username"]}>Change Password</button>
                    <button className={styles["delete-account"]}>Delete Account</button>
                </div>
            </div>

            {showUsernameForm && (
                <UsernameForm user={user} setUser={setUser} onClose={() => setShowUsernameForm(false)} />
            )}
        </main>
    );
}

export default Account;
