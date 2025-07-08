import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  signIn,
  signUp,
  signOut,
  getUserWithProfile,
  searchUsers,
  addFriend,
  removeFriend,
  getFriends
} from "../utils/auth";
import supabase from "../utils/supabaseClient";
import styles from "./left-sidebar.module.css";

import SuccessFormMessage from "../components/SuccessFormMessage";
import ErrorFormMessage from "../components/ErrorFormMessage";
import User from "../components/rightsidebar/User";

function LeftSidebar({ user, setUser }) {
  const [activeForm, setActiveForm] = useState(null);
  const [showAccountNav, setShowAccountNav] = useState(false);
  const [signupResult, setSignupResult] = useState(null);
  const [loginResult, setLoginResult] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const formRef = useRef(null);
  const formTriggerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const u = await getUserWithProfile();
      if (u) {
        setUser(u);
        setActiveForm(null);
        setSignupResult(null);
        setLoginResult(null);
        setIsConfirming(false);
      }
    };

    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) checkAuth();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    getFriends().then(setFriends);
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = activeForm ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeForm]);

  useEffect(() => {
    if (!activeForm || !formRef.current) return;
    const container = formRef.current;
    const focusable = container.querySelectorAll("button, input, a");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trapFocus = (e) => {
      if (e.key === "Tab") {
        if (!focusable.length) return;
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
    const closeOnClickOutside = (e) => {
      if (!e.target.closest(`.${styles["account-display-relative"]}`)) {
        setShowAccountNav(false);
      }
    };
    document.addEventListener("click", closeOnClickOutside);
    return () => document.removeEventListener("click", closeOnClickOutside);
  }, []);

  const handleFormBlurClick = (e) => {
    if (e.target.classList.contains("form-blur")) {
      setActiveForm(null);
      formTriggerRef.current?.focus();
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isConfirming) return;

    setSignupResult(null);
    setIsConfirming(true);

    const email = e.target.elements["desktop-user-email"].value;
    const password = e.target.elements["desktop-user-password"].value;
    const result = await signUp(email, password);

    if (result.error) {
      setSignupResult("error");
      setIsConfirming(false);
    } else {
      setSignupResult("success");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginResult(null);
    const email = e.target.elements["desktop-user-email"].value;
    const password = e.target.elements["desktop-user-password"].value;
    const result = await signIn(email, password);
    if (result.error) {
      setLoginResult("error");
    } else {
      const u = await getUserWithProfile();
      if (u) setUser(u);
      setLoginResult("success");
      setTimeout(() => {
        setActiveForm(null);
        setLoginResult(null);
      }, 1500);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setShowAccountNav(false);
    navigate("/");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const results = await searchUsers(query.trim());
    setSearchResults(results);
  };

  const handleCloseResults = () => {
    setSearchResults(null);
    setQuery("");
  };

  const handleAddFriend = async (id) => {
    const res = await addFriend(id);
    if (res.success) getFriends().then(setFriends);
  };

  const handleRemoveFriend = async (id) => {
    const res = await removeFriend(id);
    if (res.success) getFriends().then(setFriends);
  };

  const isFriend = (id) => friends.some((f) => f.id === id);

  return (
    <aside className={styles.aside}>
      <NavLink to="/" className={styles.logoContainer}>
        <h2 className={styles.logo}>Grid<span>Sync</span></h2>
        <span>Connect</span>
      </NavLink>

      {user && (
        <div className={styles["account-display-relative"]}>
          <button className={`${styles["account-display"]} ${showAccountNav ? styles.active : ""}`} onClick={() => setShowAccountNav(!showAccountNav)} aria-label="Toggle account menu">
            <div className={styles["account-info"]}>
              <img src={user.profile_picture || "/placeholder.webp"} width="60" height="60" alt="profile" />
              <div>
                <h2 className={styles.username}>{user.username}</h2>
                <p className={styles["account-title"]}>{user.title}</p>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
          </button>
          {showAccountNav && (
            <div className={styles["account-display-nav"]}>
              <NavLink to="/account"><i className="fa-solid fa-circle-user" aria-hidden="true"></i> Manage Account</NavLink>
              <button className={styles["log-out-of-account"]} onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i> Log out</button>
            </div>
          )}
        </div>
      )}

      {!user && (
        <div className="login-plus-signup">
          <button className="open-login-dialog" onClick={(e) => { setActiveForm("login"); formTriggerRef.current = e.currentTarget; }}>Log in</button>
          <button className="open-signup-dialog" onClick={(e) => { setActiveForm("signup"); formTriggerRef.current = e.currentTarget; }}>Sign up</button>
        </div>
      )}

      <nav className={styles["primary-links"]}>
        <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ""}><i className="fa-solid fa-house"></i>Home</NavLink>
        <NavLink to="/library" className={({ isActive }) => isActive ? styles.active : ""}><i className="fa-solid fa-gamepad"></i>Library</NavLink>
        <NavLink to="/store" className={({ isActive }) => isActive ? styles.active : ""}><i className="fa-solid fa-store"></i>Store</NavLink>
        <NavLink to="/subscribe" className={({ isActive }) => isActive ? styles.active : ""}><i className="fa-solid fa-plus"></i>Subscribe</NavLink>
      </nav>

      <div className={styles["search-content"]}>
        <div className={styles.searchHeader}>
          <button title="Friends"><i className="fa-solid fa-user-group"></i></button>
          <form className={styles["search-form"]} onSubmit={handleSearch}>
            <div>
              <button type="submit" aria-label="search-button"><i className="fa-solid fa-magnifying-glass"></i></button>
              <label htmlFor="desktop-search-input-field">Search</label>
              <input type="text" id="desktop-search-input-field" placeholder="Search for any player" required value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </form>
        </div>

        <div className={styles["main-content"]}>
          {searchResults !== null && (
            <div className={`${styles.section} ${styles.results}`}>
              <div className={styles["title"]}>
                <h2>Results<button onClick={handleCloseResults} className={styles["close-search-results"]}><i className="fa-solid fa-xmark"></i></button></h2>
              </div>
              <div className={styles["user-results"]}>
                {searchResults.length === 0 ? (
                  <p className={styles["no-users-found"]}>No users found.</p>
                ) : (
                  searchResults.map((u) => (
                    <User
                      key={u.id}
                      img={u.profile_picture || "/placeholder.webp"}
                      username={u.username}
                      title={u.title}
                      canAdd={!!user && !isFriend(u.id)}
                      canRemove={!!user && isFriend(u.id)}
                      onAddClick={() => handleAddFriend(u.id)}
                      onRemoveClick={() => handleRemoveFriend(u.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles["title"]}>
              <h2>Friends</h2>
              {friends.length > 0 && <span className={styles["number-of-friends-added"]}>{friends.length}</span>}
            </div>
            {friends.length === 0 ? (
              <div className={styles["no-friends-state"]}>
                <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
                <p>{user ? "No Friends Added" : "You must be signed in to Add Friends"}</p>
              </div>
            ) : (
              <div className={styles["friends-state"]}>
                {friends.map((f) => (
                  <User
                    key={f.id}
                    img={f.profile_picture || "/placeholder.webp"}
                    username={f.username}
                    title={f.title}
                    canAdd={false}
                    canRemove={true}
                    onRemoveClick={() => handleRemoveFriend(f.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={formRef}>
        {activeForm === "login" && (
          <div className={`${styles["login-form"]} ${styles["form-blur"]} form-blur`} onClick={handleFormBlurClick}>
            <form onSubmit={handleLogin} onClick={(e) => e.stopPropagation()}>
              <div className={styles.header}>
                <h2>Sign In</h2>
                <button type="button" className={styles["close-form"]} onClick={() => { setActiveForm(null); formTriggerRef.current?.focus(); setLoginResult(null); }}><i className="fa-solid fa-xmark"></i></button>
              </div>
              <div className={styles["input-grouping"]}><label htmlFor="desktop-user-email">Email</label><input type="email" id="desktop-user-email" placeholder="Enter your email" required /></div>
              <div className={styles["input-grouping"]}><label htmlFor="desktop-user-password">Password</label><input type="password" id="desktop-user-password" placeholder="Enter your password" required /></div>
              {loginResult === "success" && <SuccessFormMessage des="You're now signed into your account." />}
              {loginResult === "error" && <ErrorFormMessage des="Sign in failed. Please try again." />}
              <button type="button" className={styles.redirect} onClick={() => { setActiveForm("signup"); setLoginResult(null); }}>Don't have an account? <span>Sign up</span></button>
              <button className={styles["form-submission"]}>Sign in</button>
            </form>
          </div>
        )}

        {activeForm === "signup" && (
          <div className={`${styles["signup-form"]} ${styles["form-blur"]} form-blur`} onClick={handleFormBlurClick}>
            <form onSubmit={handleSignup} onClick={(e) => e.stopPropagation()}>
              <div className={styles.header}>
                <h2>Sign Up</h2>
                <button type="button" className={styles["close-form"]} onClick={() => { setActiveForm(null); formTriggerRef.current?.focus(); setSignupResult(null); }}><i className="fa-solid fa-xmark"></i></button>
              </div>
              <div className={styles["input-grouping"]}><label htmlFor="desktop-user-email">Email</label><input type="email" id="desktop-user-email" placeholder="Enter your email" required /></div>
              <div className={styles["input-grouping"]}><label htmlFor="desktop-user-password">Password</label><input type="password" id="desktop-user-password" placeholder="Enter your password" required /></div>
              {signupResult === "success" && <SuccessFormMessage des="Check your email to complete sign up. Your account will be activated after confirmation." />}
              {signupResult === "error" && <ErrorFormMessage des="Sign up failed. Please try again." />}
              <button type="button" className={styles.redirect} onClick={() => { setActiveForm("login"); setSignupResult(null); }}>Already have an account? <span>Log in</span></button>
              <button className={styles["form-submission"]} disabled={isConfirming} style={{ cursor: isConfirming ? "not-allowed" : "pointer" }}>
                {isConfirming ? <><i className="fa-solid fa-spinner fa-spin"></i>&nbsp;Waiting for email confirmation...</> : "Sign up"}
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
}

export default LeftSidebar;
