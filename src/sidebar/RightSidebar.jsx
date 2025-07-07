import styles from "./right-sidebar.module.css";
import User from "../components/rightsidebar/User";
import { useEffect, useState } from "react";
import { searchUsers, addFriend, removeFriend, getFriends } from "../utils/auth";

function RightSidebar({ user }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!user) return;
    getFriends().then(setFriends);
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const results = await searchUsers(query.trim());
    setSearchResults(results);
  };

  const handleAddFriend = async (friendId) => {
    const result = await addFriend(friendId);
    if (result.success) {
      const updatedFriends = await getFriends();
      setFriends(updatedFriends);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    const result = await removeFriend(friendId);
    if (result.success) {
      const updatedFriends = await getFriends();
      setFriends(updatedFriends);
    }
  };

  const handleCloseResults = () => setSearchResults(null);

  const isFriend = (id) => friends.some(f => f.id === id);

  return (
    <aside className={styles.aside}>
      <div className={styles.header}>
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
            <div className={styles["title"]}><h2>Results<button className={styles["close-search-results"]} title="Close search results" onClick={handleCloseResults}><i className="fa-solid fa-xmark" aria-hidden="true"></i></button></h2></div>
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
                <User key={f.id} img={f.profile_picture || "/placeholder.webp"} username={f.username} title={f.title} canAdd={false} canRemove={true} onRemoveClick={() => handleRemoveFriend(f.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
