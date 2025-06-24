import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./header.module.css";
import { signIn, signUp, signOut, getUserWithProfile, searchUsers, addFriend, removeFriend, getFriends } from "../utils/auth";
import User from "./rightsidebar/User";
import SuccessFormMessage from "../components/SuccessFormMessage";
import ErrorFormMessage from "../components/ErrorFormMessage";

function Header({ title }) {
  const location = useLocation();
  const getActive = (path) => (location.pathname === path ? styles.active : "");

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [user, setUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

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
    if (!menuOpen && !activeForm) return;
    const container = activeForm
      ? menuRef.current.querySelector(`.${styles[`${activeForm}-form`]}`)
      : menuRef.current;
    const focusable = container?.querySelectorAll("button, input, a");
    const first = focusable?.[0], last = focusable?.[focusable.length - 1];
    first?.focus();
    const trapFocus = e => {
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
    setShowSuccess(false); setShowError(false);
    const email = e.target.elements["mobile-user-email"].value;
    const password = e.target.elements["mobile-user-password"].value;
    const result = await signIn(email, password);
    if (result.error) setShowError(true);
    else {
      const u = await getUserWithProfile();
      if (u) setUser(u);
      setShowSuccess(true);
      setTimeout(() => { setActiveForm(null); setShowSuccess(false); }, 1500);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setShowSuccess(false); setShowError(false);
    const email = e.target.elements["mobile-user-email"].value;
    const password = e.target.elements["mobile-user-password"].value;
    const result = await signUp(email, password);
    if (result.error) setShowError(true);
    else {
      const u = await getUserWithProfile();
      if (u) setUser(u);
      setShowSuccess(true);
      setTimeout(() => { setActiveForm(null); setShowSuccess(false); }, 1500);
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
        <Link to="/" className={styles.subscribe}>Subscribe to GridSync+</Link>
        <button className={styles["mobile-menu"]} aria-label="Open menu" onClick={(e) => { setMenuOpen(true); lastTriggerRef.current = e.currentTarget; }}>
          <i className="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
        </button>

        <div ref={menuRef} className={`${styles["mobile-menu-blur"]} ${menuOpen ? styles.show : ""}`} aria-hidden={!menuOpen}>
          <div className={styles["mobile-menu-header"]}>
            <Link to="/">Grid<span>Sync</span></Link>
            <button className={styles["mobile-menu-close"]} onClick={() => { setMenuOpen(false); setActiveForm(null); lastTriggerRef.current?.focus(); }} aria-label="Close menu">
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          {user ? (
            <div className={styles["account-display-relative"]}>
              <div className={styles.profile}>
                <img src={user.profile_picture || "/placeholder.png"} width="80" height="80" alt="profile image" />
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
                      <button type="button" className={styles["close-form"]} onClick={() => { setActiveForm(null); lastTriggerRef.current?.focus(); }} aria-label="Close login form"><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
                    </div>
                    <div className={styles["form-divider"]}><span></span><span className={styles.label}>Grid<span>Sync</span></span><span></span></div>
                    <div className={styles["input-grouping"]}><label htmlFor="mobile-user-email">Email</label><input type="email" placeholder="Email" id="mobile-user-email" required /></div>
                    <div className={styles["input-grouping"]}><label htmlFor="mobile-user-password">Password</label><input type="password" placeholder="Password" id="mobile-user-password" required /></div>
                    {showSuccess && <SuccessFormMessage des="Signed in successfully." />}
                    {showError && <ErrorFormMessage des="Sign-in failed." />}
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
                      <button type="button" className={styles["close-form"]} onClick={() => { setActiveForm(null); lastTriggerRef.current?.focus(); }} aria-label="Close signup form"><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
                    </div>
                    <div className={styles["form-divider"]}><span></span><span className={styles.label}>Grid<span>Sync</span></span><span></span></div>
                    <div className={styles["input-grouping"]}><label htmlFor="mobile-user-email">Email</label><input type="email" placeholder="Email" id="mobile-user-email" required /></div>
                    <div className={styles["input-grouping"]}><label htmlFor="mobile-user-password">Password</label><input type="password" placeholder="Password" id="mobile-user-password" required /></div>
                    {showSuccess && <SuccessFormMessage des="Account created successfully." />}
                    {showError && <ErrorFormMessage des="Signup failed." />}
                    <button type="button" className={styles.redirect} onClick={() => setActiveForm("login")}>Already have an account? <span>Log in</span></button>
                    <button className={styles["form-submission"]}>Sign up</button>
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
              <button aria-label="view friends group" title="Friends"><i className="fa-solid fa-user-group" aria-hidden="true"></i></button>
              <form className={styles["search-form"]} onSubmit={handleSearch}>
                <div>
                  <button id="search-btn" type="submit" aria-label="search-button"><i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i></button>
                  <label htmlFor="search-input-field">Search</label>
                  <input type="text" placeholder="Search for any player" required id="search-input-field" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
              </form>
            </div>

            <div className={styles["main-content"]}>
              {searchResults !== null && (
                <div className={`${styles.section} ${styles.results}`}>
                  <div className={styles["title"]}>
                    <h2>Results<button className={styles["close-search-results"]} title="Close search results" onClick={handleCloseResults}><i className="fa-solid fa-xmark" aria-hidden="true"></i></button></h2>
                  </div>
                  <div className={styles["user-results"]}>
                    {searchResults.length === 0 ? (
                      <p className={styles["no-users-found"]}>No users found.</p>
                    ) : (
                      searchResults.map((u) => (
                        <User
                          key={u.id}
                          img={u.profile_picture || "/placeholder.png"}
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
                    <p>{user ? "No Friends Added" : "You must be signed in to Add Friends"}</p>
                  </div>
                ) : (
                  <div className={styles["friends-state"]}>
                    {friends.map((f) => (
                      <User key={f.id} img={f.profile_picture || "/placeholder.png"} username={f.username} title={f.title} canAdd={false} canRemove={true} onRemoveClick={() => handleRemoveFriend(f.id)} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
