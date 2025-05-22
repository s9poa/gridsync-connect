import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { signIn, signUp, signOut, getUserWithProfile } from "../utils/auth";
import styles from "./left-sidebar.module.css";

function LeftSidebar({ user, setUser }) {
    const [activeForm, setActiveForm] = useState(null);
    const [showAccountNav, setShowAccountNav] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        if (!activeForm) return;

        const container = formRef.current?.querySelector(`.${activeForm}-form`);
        if (!container) return;

        const focusable = container.querySelectorAll("button, input, a");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        first?.focus();

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
                setActiveForm(null);
            }
        };

        document.addEventListener("keydown", trapFocus);
        return () => document.removeEventListener("keydown", trapFocus);
    }, [activeForm]);

    const handleFormBlurClick = e => {
        if (e.target.classList.contains("form-blur")) setActiveForm(null);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const email = e.target.elements["user-email"].value;
        const password = e.target.elements["user-password"].value;
        const result = await signUp(email, password);
        if (result.error) {
            alert("Sign-up failed: " + result.error);
        } else {
            const userData = await getUserWithProfile();
            if (userData) setUser(userData);
            setActiveForm(null);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.elements["user-email"].value;
        const password = e.target.elements["user-password"].value;
        const result = await signIn(email, password);
        if (result.error) {
            alert("Login failed: " + result.error);
        } else {
            const userData = await getUserWithProfile();
            if (userData) setUser(userData);
            setActiveForm(null);
        }
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setShowAccountNav(false);
    };

    return (
        <aside className={styles.aside}>
            <Link to="/" className={styles.logo}>Grid<span>Sync</span></Link>
            <div className={styles["beta-divider"]}>
                <span className={styles.divider}></span>
                <span>Beta</span>
                <span className={styles.divider}></span>
            </div>

            {user && (
                <div className={styles["account-display-relative"]}>
                    <button className={styles["account-display"]} aria-label="open profile navigation" onClick={() => setShowAccountNav(!showAccountNav)}>
                        <div className={styles["account-info"]}>
                            <img src="/placeholder.png" width="60" height="60" alt="" />
                            <div>
                                <h2 className={styles.username}>{user.username}</h2>
                                <p className={styles["account-title"]}>{user.title}</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                    </button>
                    {showAccountNav && (
                        <div className={styles["account-display-nav"]}>
                            <button id="log-out-of-account" onClick={handleLogout}>Log out</button>
                        </div>
                    )}
                </div>
            )}

            {!user && (
                <div className="login-plus-signup">
                    <button className="open-login-dialog" onClick={() => setActiveForm("login")}>Log in</button>
                    <button className="open-signup-dialog" onClick={() => setActiveForm("signup")}>Sign up</button>
                </div>
            )}

            <div ref={formRef}>
                {activeForm === "login" && (
                    <div className="login-form form-blur" onClick={handleFormBlurClick}>
                        <form onSubmit={handleLogin} onClick={e => e.stopPropagation()}>
                            <div className="header">
                                <h2>Sign In</h2>
                                <button type="button" className="close-form" onClick={() => setActiveForm(null)} aria-label="Close log-in form"><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
                            </div>
                            <div className="form-divider">
                                <span></span>
                                <span className="label">Grid<span>Sync</span></span>
                                <span></span>
                            </div>
                            <div className="input-grouping">
                                <label htmlFor="user-email">Email</label>
                                <input type="email" placeholder="Your e-mail" id="user-email" required />
                            </div>
                            <div className="input-grouping">
                                <label htmlFor="user-password">Password</label>
                                <input type="password" placeholder="Your password" id="user-password" required />
                            </div>
                            <button type="button" className="redirect" onClick={() => setActiveForm("signup")}>Don't have an account? <span>Sign up</span></button>
                            <button className="form-submission">Sign in</button>
                        </form>
                    </div>
                )}

                {activeForm === "signup" && (
                    <div className="signup-form form-blur" onClick={handleFormBlurClick}>
                        <form onSubmit={handleSignup} onClick={e => e.stopPropagation()}>
                            <div className="header">
                                <h2>Sign Up</h2>
                                <button type="button" className="close-form" onClick={() => setActiveForm(null)} aria-label="Close sign-up form"><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
                            </div>
                            <div className="form-divider">
                                <span></span>
                                <span className="label">Grid<span>Sync</span></span>
                                <span></span>
                            </div>
                            <div className="input-grouping">
                                <label htmlFor="user-email">Email</label>
                                <input type="email" placeholder="Your e-mail" id="user-email" required />
                            </div>
                            <div className="input-grouping">
                                <label htmlFor="user-password">Password</label>
                                <input type="password" placeholder="Your password" id="user-password" required />
                            </div>
                            <button type="button" className="redirect" onClick={() => setActiveForm("login")}>Already have an account? <span>Log in</span></button>
                            <button className="form-submission">Sign up</button>
                        </form>
                    </div>
                )}
            </div>
        </aside>
    )
}

export default LeftSidebar;
