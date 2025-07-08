import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./header.module.css";
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
import User from "./rightsidebar/User";
import SuccessFormMessage from "../components/SuccessFormMessage";
import ErrorFormMessage from "../components/ErrorFormMessage";

function Header({ title }) {
  const location = useLocation();
  const getActive = (path) => (location.pathname === path ? styles.active : "");

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [user, setUser] = useState(null);

  const [signupResult, setSignupResult] = useState(null);
  const [loginResult, setLoginResult] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [friends, setFriends] = useState([]);

  const menuRef = useRef(null);
  const lastTriggerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const u = await getUserWithProfile();
      if (u) setUser(u);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    async function fetchFriends() {
      const f = await getFriends();
      setFriends(f);
    }
    fetchFriends();
  }, [user]);

    useEffect(() => {
    document.body.style.overflow = activeForm ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
    }, [activeForm]);

  useEffect(() => {
    if (!menuOpen && !activeForm) return;
    const container = activeForm
      ? menuRef.current.querySelector(`.${styles[`${activeForm}-form`]}`)
      : menuRef.current;
    const focusable = container?.querySelectorAll("button, input, a");
    const first = focusable?.[0], last = focusable[focusable.length - 1];
    first?.focus();

    const trapFocus = (e) => {
      if (e.key === "Tab" && focusable?.length) {
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      } else if (e.key === "Escape") {
        if (activeForm) { setActiveForm(null); lastTriggerRef.current?.focus(); }
        else { setMenuOpen(false); lastTriggerRef.current?.focus(); }
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [menuOpen, activeForm]);

  const handleFormBlurClick = (e) => {
    if (e.target.classList.contains(styles["form-blur"])) {
      setActiveForm(null);
      lastTriggerRef.current?.focus();
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoginResult(null);

    const email = e.target.elements["mobile-user-email"].value;
    const password = e.target.elements["mobile-user-password"].value;
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (isConfirming) return;

    setSignupResult(null);
    setIsConfirming(true);

    const email = e.target.elements["mobile-user-email"].value;
    const password = e.target.elements["mobile-user-password"].value;
    const result = await signUp(email, password);

    if (result.error) {
      setSignupResult("error");
      setIsConfirming(false);
    } else {
      setSignupResult("success");
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setMenuOpen(false);
    setActiveForm(null);
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

  const isFriend = (id) => friends.some(f => f.id === id);

  return (
    <header className={styles.header}>
      <h1>{title}</h1>
      <div>
        <button
          className={styles["mobile-menu"]}
          aria-label="Open menu"
          onClick={(e) => { setMenuOpen(true); lastTriggerRef.current = e.currentTarget; }}
        >
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>

        <div
          ref={menuRef}
          className={`${styles["mobile-menu-blur"]} ${menuOpen ? styles.show : ""}`}
          aria-hidden={!menuOpen}
        >
          <div className={styles["mobile-menu-header"]}>
            <button
              className={styles["mobile-menu-close"]}
              onClick={() => { setMenuOpen(false); setActiveForm(null); lastTriggerRef.current?.focus(); }}
              aria-label="Close menu"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {user ? (
            <div className={styles["account-display-relative"]}>
              <div className={styles.profile}>
                <img src={user.profile_picture || "/placeholder.webp"} width="80" height="80" alt="profile image" />
                <h2 className={styles.username}>{user.username}</h2>
                <p className={styles["account-title"]}>{user.title}</p>
              </div>
              <div className={styles["account-access-links"]}>
                <Link to="/account" className={styles["manage-account"]}>Manage Account</Link>
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
                <div className={`${styles["login-form"]} ${styles["form-blur"]}`} onClick={handleFormBlurClick}>
                  <form onSubmit={handleSignIn} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.header}>
                      <h2>Sign In</h2>
                      <button
                        type="button"
                        className={styles["close-form"]}
                        onClick={() => { setActiveForm(null); lastTriggerRef.current?.focus(); }}
                        aria-label="Close login form"
                      ><i className="fa-solid fa-xmark"></i></button>
                    </div>
                    <div className={styles["input-grouping"]}><label htmlFor="mobile-user-email">Email</label><input type="email" placeholder="Enter your email" id="mobile-user-email" required /></div>
                    <div className={styles["input-grouping"]}><label htmlFor="mobile-user-password">Password</label><input type="password" placeholder="Enter your password" id="mobile-user-password" required /></div>
                    {loginResult === "success" && <SuccessFormMessage des="Signed in successfully." />}
                    {loginResult === "error" && <ErrorFormMessage des="Sign-in failed." />}
                    <button type="button" className={styles.redirect} onClick={() => setActiveForm("signup")}>Don't have an account? <span>Sign up</span></button>
                    <button className={styles["form-submission"]}>Sign in</button>
                  </form>
                </div>
              )}

              {activeForm === "signup" && (
                <div className={`${styles["signup-form"]} ${styles["form-blur"]}`} onClick={handleFormBlurClick}>
                  <form onSubmit={handleSignUp} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.header}>
                      <h2>Sign Up</h2>
                      <button
                        type="button"
                        className={styles["close-form"]}
                        onClick={() => { setActiveForm(null); lastTriggerRef.current?.focus(); }}
                        aria-label="Close signup form"
                      ><i className="fa-solid fa-xmark"></i></button>
                    </div>
                    <div className={styles["input-grouping"]}><label htmlFor="mobile-user-email">Email</label><input type="email" placeholder="Enter your email" id="mobile-user-email" required /></div>
                    <div className={styles["input-grouping"]}><label htmlFor="mobile-user-password">Password</label><input type="password" placeholder="Enter your password" id="mobile-user-password" required /></div>
                    {signupResult === "success" && <SuccessFormMessage des="Check your email to complete sign-up." />}
                    {signupResult === "error" && <ErrorFormMessage des="Sign-up failed. Please try again." />}
                    <button type="button" className={styles.redirect} onClick={() => setActiveForm("login")}>Already have an account? <span>Log in</span></button>
                    <button
                      className={styles["form-submission"]}
                      disabled={isConfirming}
                      style={{ cursor: isConfirming ? "not-allowed" : "pointer" }}
                    >
                      {isConfirming
                        ? <><i className="fa-solid fa-spinner fa-spin"></i>&nbsp;Waiting for email confirmation...</>
                        : "Sign up"}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          <nav className={styles["primary-links"]}>
            <Link to="/" className={getActive("/")}>Home</Link>
            <Link to="/library" className={getActive("/library")}>Library</Link>
            <Link to="/store" className={getActive("/store")}>Store</Link>
            <Link to="/subscribe" className={getActive("/subscribe")}>Subscribe</Link>
          </nav>

          <div className={styles["search-content"]}>
            <div className={styles.searchHeader}>
              <button aria-label="view friends group" title="Friends"><i className="fa-solid fa-user-group"></i></button>
              <form className={styles["search-form"]} onSubmit={handleSearch}>
                <div>
                  <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                  <label htmlFor="mobile-search-input-field">Search</label>
                  <input id="mobile-search-input-field" type="text" placeholder="Search for any player" value={query} onChange={(e) => setQuery(e.target.value)} required />
                </div>
              </form>
            </div>
            <div className={styles["main-content"]}>
              {searchResults && (
                <div className={`${styles.section} ${styles.results}`}>
                  <div className={styles["title"]}>
                    <h2>Results<button onClick={handleCloseResults} className={styles["close-search-results"]}><i className="fa-solid fa-xmark"></i></button></h2>
                  </div>
                  <div className={styles["user-results"]}>
                    {searchResults.length === 0 ? (
                      <p className={styles["no-users-found"]}>No users found.</p>
                    ) : (
                      searchResults.map(u => (
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
