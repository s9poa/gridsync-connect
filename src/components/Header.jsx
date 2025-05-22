import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.css";
import { signIn, signUp, signOut, getUserWithProfile } from "../utils/auth";

function Header({ title }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeForm, setActiveForm] = useState(null);
    const [user, setUser] = useState(null);
    const menuRef = useRef(null);
    const lastTriggerRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUserWithProfile();
            if (userData) setUser(userData);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!menuOpen) return;

        const container = activeForm
            ? menuRef.current.querySelector(`.${activeForm}-form`)
            : menuRef.current;

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
                if (activeForm) {
                    setActiveForm(null);
                } else {
                    setMenuOpen(false);
                    lastTriggerRef.current?.focus();
                }
            }
        };

        document.addEventListener("keydown", trapFocus);
        return () => document.removeEventListener("keydown", trapFocus);
    }, [menuOpen, activeForm]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        const email = e.target.elements["mobile-user-email"].value;
        const password = e.target.elements["mobile-user-password"].value;
        const result = await signIn(email, password);
        if (result.error) {
            alert("Login failed: " + result.error);
        } else {
            const userData = await getUserWithProfile();
            if (userData) setUser(userData);
            setActiveForm(null);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const email = e.target.elements["mobile-user-email"].value;
        const password = e.target.elements["mobile-user-password"].value;
        const result = await signUp(email, password);
        if (result.error) {
            alert("Sign-up failed: " + result.error);
        } else {
            const userData = await getUserWithProfile();
            if (userData) setUser(userData);
            setActiveForm(null);
        }
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setMenuOpen(false);
        setActiveForm(null);
    };

    const handleFormBlurClick = e => {
        if (e.target.classList.contains("form-blur")) setActiveForm(null);
    };

    return (
        <header className={styles.header}>
            <h1>{title}</h1>
            <div>
                <Link to="/" className={styles.subscribe}>Subscribe too GridSync+</Link>
                <button className={styles["mobile-menu"]} aria-label="Open menu" onClick={e => { setMenuOpen(true); lastTriggerRef.current = e.currentTarget; }}>
                    <i className="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
                </button>

                <div ref={menuRef} className={`${styles["mobile-menu-blur"]} ${menuOpen ? styles["show"] : ""}`} aria-hidden={!menuOpen}>
                    <div className={styles["mobile-menu-header"]}>
                        <Link to="/">Grid<span>Sync</span></Link>
                        <button className={styles["mobile-menu-close"]} onClick={() => { setMenuOpen(false); setActiveForm(null); lastTriggerRef.current?.focus(); }} aria-label="Close menu">
                            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                        </button>
                    </div>

                    {user ? (
                        <div className={styles["account-display-relative"]}>
                            <div className={styles.profile}>
                                <img src="/placeholder.png" width="60" height="60" alt="" />
                                <h2 className={styles.username}>{user.username}</h2>
                                <p className={styles["account-title"]}>{user.title}</p>
                            </div>
                            <div className={styles["account-access-links"]}>
                                <Link to="/" className={styles["manage-account"]}>Manage Account</Link>
                                <button className={styles["log-out"]} onClick={handleLogout}>Log out</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="login-plus-signup">
                                <button className="open-login-dialog" onClick={() => setActiveForm("login")}>Log in</button>
                                <button className="open-signup-dialog" onClick={() => setActiveForm("signup")}>Sign up</button>
                            </div>

                            {activeForm === "login" && (
                                <div className="login-form form-blur" onClick={handleFormBlurClick}>
                                    <form onSubmit={handleSignIn} onClick={e => e.stopPropagation()}>
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
                                            <label htmlFor="mobile-user-email">Email</label>
                                            <input type="email" placeholder="Your e-mail" id="mobile-user-email" required />
                                        </div>
                                        <div className="input-grouping">
                                            <label htmlFor="mobile-user-password">Password</label>
                                            <input type="password" placeholder="Your password" id="mobile-user-password" required />
                                        </div>
                                        <button type="button" className="redirect" onClick={() => setActiveForm("signup")}>Don't have an account? <span>Sign up</span></button>
                                        <button className="form-submission">Sign in</button>
                                    </form>
                                </div>
                            )}

                            {activeForm === "signup" && (
                                <div className="signup-form form-blur" onClick={handleFormBlurClick}>
                                    <form onSubmit={handleSignUp} onClick={e => e.stopPropagation()}>
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
                                            <label htmlFor="mobile-user-email">Email</label>
                                            <input type="email" placeholder="Your e-mail" id="mobile-user-email" required />
                                        </div>
                                        <div className="input-grouping">
                                            <label htmlFor="mobile-user-password">Password</label>
                                            <input type="password" placeholder="Your password" id="mobile-user-password" required />
                                        </div>
                                        <button type="button" className="redirect" onClick={() => setActiveForm("login")}>Already have an account? <span>Log in</span></button>
                                        <button className="form-submission">Sign up</button>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header;
