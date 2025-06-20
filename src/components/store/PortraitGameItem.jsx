import styles from '../../global-css/portrait-game-item.module.css';
import { addFavorite, getFavorites, removeFavorite } from '../../utils/auth';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';

function PortraitGameItem({ user, onSuccess, onError, link, img, discount, title, des, previousPrice, price }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);

    useEffect(() => {
        const checkFavorite = async () => {
            if (!user) return;
            const favs = await getFavorites();
            const match = favs.find(f => f.title === title);
            if (match) {
                setIsFavorited(true);
                setFavoriteId(match.id);
            }
        };
        checkFavorite();
    }, [user, title]);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        if (!user) return;

        if (isFavorited && favoriteId) {
            const result = await removeFavorite(favoriteId);
            if (result.success) {
                setIsFavorited(false);
                setFavoriteId(null);
                onSuccess?.("Removed from Favorites.");
            } else {
                onError?.();
            }
        } else {
            const result = await addFavorite({
                game_id: title.toLowerCase().replace(/\s+/g, '-'),
                title,
                image_path: img,
                price,
                type: 'portrait'
            });

            if (result.success) {
                const favs = await getFavorites();
                const match = favs.find(f => f.title === title);
                if (match) setFavoriteId(match.id);
                setIsFavorited(true);
                onSuccess?.("Added to Favorites.");
            } else {
                onError?.();
            }
        }
    };

    return (
        <Link to={link} className={`${styles["container"]} main-content-child`}>
            <img src={img} className={styles.img} alt="" />
            <div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.des}>{des}</p>
                <div>
                    <span className={styles.discount}>{discount}</span>
                    <span className={styles.previousPrice}>{previousPrice}</span>
                    <span className={styles.price}>{price}</span>
                </div>
            </div>
            {user && (
                <button className={`${styles["add-to-library-btn"]} add-to-library-btn`} onClick={handleToggleFavorite}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={isFavorited ? "#ffffff" : "none"} stroke="#ffffff" strokeWidth="60">
                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
                    </svg>
                </button>
            )}
        </Link>
    );
}

export default PortraitGameItem;
