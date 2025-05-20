import { useState } from "react";
import styles from "./left-sidebar.module.css";

import { signUp } from '../utils/auth';
import { Link } from "react-router";

function LeftSidebar ({ user }) {
    const [activeForm, setActiveForm] = useState(null);
    const [showAccountNav, setShowAccountNav] = useState(false);

    const handleClickOutside = e => {
        if (e.target.classList.contains(styles["form-blur"])) setActiveForm(null);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const email = e.target.elements['user-email'].value;
        const password = e.target.elements['user-password'].value;

        const result = await signUp(email, password);

        if (result.error) {
            alert("Sign-up failed: " + result.error);
        } else {
            alert("Welcome! You're signed up.");
            setActiveForm(null);
            // You’ll later update user state here after login
        }
    };

    return (
        <aside className={styles.aside}>
            <Link to="/" className={styles.logo}>Grid<span>Sync</span></Link>
            <div className={styles["beta-divider"]}>
                <span className={styles.divider}></span>
                <span>Beta</span>
                <span className={styles.divider}></span>
            </div>
            {/* Display when user is signed in */}
            {user && (
                <button className={styles["account-display"]} aria-label="open profile navigation" onClick={() => setShowAccountNav(!showAccountNav)}>
                    <div className={styles["account-info"]}>
                        <img src="/placeholder.png" width="60" height="60" alt=""/>
                        <div>
                            <h2 className={styles.username}>{user.username}</h2>
                            <p className={styles["account-title"]}>{user.title}</p>
                        </div>
                    </div>
                    <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                    {/* Popup for Navigation when the "account-display" btn is clicked */}
                    {showAccountNav && (
                        <div className={styles["account-display-nav"]}>
                            <button id="log-out-of-account">Log out</button>
                        </div>
                    )}
                </button>
            )}
            {/* Display when user is NOT signed in */}
            {!user && (
                <div className={styles["login-plus-signup"]}>
                    <button className={styles["open-login-dialog"]} onClick={() => setActiveForm("login")}>Log in</button>
                    <button className={styles["open-signup-dialog"]} onClick={() => setActiveForm("signup")}>Sign up</button>
                </div>
            )}
            {/* Display when open-login-dialog is clicked */}
            {activeForm === "login" && (
                <div className={`${styles["login-form"]} ${styles["form-blur"]}`} onClick={handleClickOutside}>
                    <form onClick={e => e.stopPropagation()}>
                        <div className={styles.header}>
                            <h2>Sign In</h2>
                            <button type="button" className={styles["close-form"]} aria-label="Close log-in form" onClick={() => setActiveForm(null)}><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
                        </div>
                        <div className={styles["form-divider"]}>
                            <span></span>
                            <span className={styles.label}>Grid<span>Sync</span></span>
                            <span></span>
                        </div>
                        <div className={styles["input-grouping"]}>
                            <label htmlFor="user-email">Email</label>
                            <input type="email" placeholder="Your e-mail" id="user-email" required />
                        </div>
                        <div className={styles["input-grouping"]}>
                            <label htmlFor="user-password">Password</label>
                            <input type="password" placeholder="Your password" id="user-password" required />
                        </div>
                        {/* If this button is clicked on, it closes the current form and opens the sign up form instead */}
                        <button type="button" className={styles.redirect} onClick={() => setActiveForm("signup")}>Don't have an account? <span>Sign up</span></button>
                        <button className={styles["form-submission"]}>Sign in</button>
                    </form>
                </div>
            )}
            {/* Display when open-signup-dialog is clicked */}
            {activeForm === "signup" && (
                <div className={`${styles["signup-form"]} ${styles["form-blur"]}`} onClick={handleClickOutside}>
                    <form onSubmit={handleSignup} onClick={e => e.stopPropagation()}>
                        <div className={styles.header}>
                            <h2>Sign Up</h2>
                            <button type="button" className={styles["close-form"]} aria-label="Close sign-up form" onClick={() => setActiveForm(null)}><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
                        </div>
                        <div className={styles["form-divider"]}>
                            <span></span>
                            <span className={styles.label}>Grid<span>Sync</span></span>
                            <span></span>
                        </div>
                        <div className={styles["input-grouping"]}>
                            <label htmlFor="user-email">Email</label>
                            <input type="email" placeholder="Your e-mail" id="user-email" required />
                        </div>
                        <div className={styles["input-grouping"]}>
                            <label htmlFor="user-password">Password</label>
                            <input type="password" placeholder="Your password" id="user-password" required />
                        </div>
                        {/* If this button is clicked on, it closes the current form and opens the sign in form instead */}
                        <button type="button" className={styles.redirect} onClick={() => setActiveForm("login")}>Already have an account? <span>Log in</span></button>
                        <button className={styles["form-submission"]}>Sign up</button>
                    </form>
                </div>
            )}
        </aside>
    )
}

export default LeftSidebar;
