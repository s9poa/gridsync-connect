import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
    const location = useLocation();

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

    useEffect(() => {
        const closeOnClickOutside = e => {
            if (!e.target.closest(`.${styles["account-display-relative"]}`)) {
                setShowAccountNav(false);
            }
        };
        document.addEventListener("click", closeOnClickOutside);
        return () => document.removeEventListener("click", closeOnClickOutside);
    }, []);

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
            <NavLink to="/" className={styles.logo}>Grid<span>Sync</span></NavLink>
            <div className={styles["beta-divider"]}>
                <span className={styles.divider}></span>
                <span>Connect</span>
                <span className={styles.divider}></span>
            </div>

            {user && (
                <div className={styles["account-display-relative"]}>
                    <button
                        className={`${styles["account-display"]} ${showAccountNav ? styles.active : ""}`}
                        aria-label="open profile navigation"
                        onClick={() => setShowAccountNav(!showAccountNav)}
                    >
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
                            <NavLink to="/account">Manage Account</NavLink>
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

            <nav className={styles["primary-links"]}>
                <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ""}><i className="fa-solid fa-house" aria-hidden="true"></i>Home</NavLink>
                <NavLink to="/library" className={({ isActive }) => isActive ? styles.active : ""}><i className="fa-solid fa-gamepad" aria-hidden="true"></i>Library</NavLink>
                <NavLink to="/store" className={({ isActive }) => isActive ? styles.active : ""}><i className="fa-solid fa-store" aria-hidden="true"></i>Store</NavLink>
                <NavLink to="/subscribe" className={({ isActive }) => isActive ? styles.active : ""}><i className="fa-solid fa-plus" aria-hidden="true"></i>Subscribe</NavLink>
            </nav>

            <div ref={formRef}>
                {/* Login and Signup Forms stay unchanged */}
                {/* ... */}
            </div>
        </aside>
    )
}

export default LeftSidebar;
