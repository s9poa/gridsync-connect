import styles from '../../global-css/landscape-game-item.module.css';
import { Link } from 'react-router';

function LandscapeGameItem ({link, img, tag, title, des, price}) {
    return (
        <Link to={link} className={`${styles["container"]} main-content-child`}>
            <img src={img} className={styles.img}alt="" />
            <div>
                {tag && <span className={styles.tag}>{tag}</span>}
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.des}>{des}</p>
                <span className={styles.price}>{price}</span>
            </div>
        </Link>
    )
}

export default LandscapeGameItem;