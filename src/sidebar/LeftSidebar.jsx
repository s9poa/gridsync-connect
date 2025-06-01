import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { signIn, signUp, signOut, getUserWithProfile } from "../utils/auth";
import styles from "./left-sidebar.module.css";

import SuccessFormMessage from "../components/SuccessFormMessage";
import ErrorFormMessage from "../components/ErrorFormMessage";

function LeftSidebar({ user, setUser }) {
    const [activeForm, setActiveForm] = useState(null);
    const [showAccountNav, setShowAccountNav] = useState(false);
    const [signupResult, setSignupResult] = useState(null);
    const [loginResult, setLoginResult] = useState(null);
    const formRef = useRef(null);
    const formTriggerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!activeForm || !formRef.current) return;

        const container = formRef.current;
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
                formTriggerRef.current?.focus();
            }
        };

        document.addEventListener("keydown", trapFocus);
        return () => document.removeEventListener("keydown", trapFocus);
    }, [activeForm]);

    const handleFormBlurClick = e => {
        if (e.target.classList.contains("form-blur")) {
            setActiveForm(null);
            formTriggerRef.current?.focus();
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setSignupResult(null);
        const email = e.target.elements["user-email"].value;
        const password = e.target.elements["user-password"].value;
        const result = await signUp(email, password);
        if (result.error) {
            setSignupResult("error");
        } else {
            const userData = await getUserWithProfile();
            if (userData) setUser(userData);
            setSignupResult("success");
            setTimeout(() => {
                setActiveForm(null);
                setSignupResult(null);
            }, 2000);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginResult(null);
        const email = e.target.elements["user-email"].value;
        const password = e.target.elements["user-password"].value;
        const result = await signIn(email, password);
        if (result.error) {
            setLoginResult("error");
        } else {
            const userData = await getUserWithProfile();
            if (userData) setUser(userData);
            setLoginResult("success");
            setTimeout(() => {
                setActiveForm(null);
                setLoginResult(null);
            }, 2000);
        }
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setShowAccountNav(false);
        navigate("/");
    };

    return (
        <aside className={styles.aside}>
            <Link to="/" className={styles.logo}>Grid<span>Sync</span></Link>
            <div className={styles["beta-divider"]}>
                <span className={styles.divider}></span>
                <span>Connect</span>
                <span className={styles.divider}></span>
            </div>

            {user && (
                <div className={styles["account-display-relative"]}>
                    <button className={styles["account-display"]} aria-label="open profile navigation" onClick={() => setShowAccountNav(!showAccountNav)}>
                        <div className={styles["account-info"]}>
                            <img src={user?.profile_picture || "/placeholder.png"} width="60" height="60" alt="profile image" />
                            <div>
                                <h2 className={styles.username}>{user.username}</h2>
                                <p className={styles["account-title"]}>{user.title}</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                    </button>
                    {showAccountNav && (
                        <div className={styles["account-display-nav"]}>
                            <Link to="/account">Manage Account</Link>
                            <button id="log-out-of-account" onClick={handleLogout}>Log out</button>
                        </div>
                    )}
                </div>
            )}

            {!user && (
                <div className="login-plus-signup">
                    <button className="open-login-dialog" onClick={e => { setActiveForm("login"); formTriggerRef.current = e.currentTarget; }}>Log in</button>
                    <button className="open-signup-dialog" onClick={e => { setActiveForm("signup"); formTriggerRef.current = e.currentTarget; }}>Sign up</button>
                </div>
            )}

            <div ref={formRef}>
                {activeForm === "login" && (
                    <div className={`${styles["login-form"]} ${styles["form-blur"]} form-blur`} onClick={handleFormBlurClick}>
                        <form onSubmit={handleLogin} onClick={e => e.stopPropagation()}>
                            <div className={styles.header}>
                                <h2>Sign In</h2>
                                <button type="button" className={styles["close-form"]} onClick={() => { setActiveForm(null); formTriggerRef.current?.focus(); setLoginResult(null); }} aria-label="Close log-in form"><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
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
                            {loginResult === "success" && <SuccessFormMessage des="You're now signed into your account." />}
                            {loginResult === "error" && <ErrorFormMessage des="Sign in failed. Please check your credentials and try again." />}
                            <button type="button" className={styles.redirect} onClick={() => { setActiveForm("signup"); setLoginResult(null); }}>Don't have an account? <span>Sign up</span></button>
                            <button className={styles["form-submission"]}>Sign in</button>
                        </form>
                    </div>
                )}

                {activeForm === "signup" && (
                    <div className={`${styles["signup-form"]} ${styles["form-blur"]} form-blur`} onClick={handleFormBlurClick}>
                        <form onSubmit={handleSignup} onClick={e => e.stopPropagation()}>
                            <div className={styles.header}>
                                <h2>Sign Up</h2>
                                <button type="button" className={styles["close-form"]} onClick={() => { setActiveForm(null); formTriggerRef.current?.focus(); setSignupResult(null); }} aria-label="Close sign-up form"><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
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
                            {signupResult === "success" && <SuccessFormMessage des="Your account has been created successfully." />}
                            {signupResult === "error" && <ErrorFormMessage des="Sign up failed. Please try again." />}
                            <button type="button" className={styles.redirect} onClick={() => { setActiveForm("login"); setSignupResult(null); }}>Already have an account? <span>Log in</span></button>
                            <button className={styles["form-submission"]}>Sign up</button>
                        </form>
                    </div>
                )}
            </div>
        </aside>
    )
}

export default LeftSidebar;
