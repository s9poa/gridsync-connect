import styles from '../css/library.module.css';
import Header from "../components/Header";
import FavoritedGame from '../components/library/FavoritedGame';
import { getFavorites, removeFavorite } from '../utils/auth';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SuccessFormMessage from '../components/SuccessFormMessage';
import ErrorFormMessage from '../components/ErrorFormMessage';
import Preloader from "../components/preloader/Preloader";

function Library({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeOutPreloader, setFadeOutPreloader] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("Removed from Favorites.");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const data = await getFavorites();
      setFavorites(data);
      setTimeout(() => {
        setFadeOutPreloader(true);
        setTimeout(() => setLoading(false), 500);
      }, 300);
    };
    fetchFavorites();
  }, [user]);

  const handleRemove = async (favId) => {
    const result = await removeFavorite(favId);
    if (result.success) {
      setFavorites(favs => favs.filter(f => f.id !== favId));
      setSuccessMsg("Removed from Favorites.");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const hasFavorites = user && favorites.length > 0;

  return (
    <main>
      <Header title="Library"/>
      {loading && <Preloader fadeOut={fadeOutPreloader}/>}
      {!loading && !hasFavorites && (
        <div className={styles["no-favorites-state"]}>
          <div>
            <img src="/library/signal.webp" alt="" />
            <p>Sign-in to Add Games into your Library</p>
            <Link to="/store">Visit Store</Link>
          </div>
        </div>
      )}
      {!loading && hasFavorites && (
        <div className={styles.grid}>
          {favorites.map(fav => (
            <FavoritedGame key={fav.id} id={fav.id} img={fav.image_path} title={fav.title} onRemove={handleRemove}/>
          ))}
        </div>
      )}
      {showSuccess && <div className={styles["msg-prompt"]}><SuccessFormMessage des={successMsg}/></div>}
      {showError && <div className={styles["msg-prompt"]}><ErrorFormMessage des="Error. Something went wrong."/></div>}
    </main>
  );
}

export default Library;
