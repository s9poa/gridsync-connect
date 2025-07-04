import styles from '../../css/store/hero.module.css';
import { Link } from 'react-router';

function Hero ({img, title, des, ctaLink, ctaText, warning, gameTitle}) {
    return (
        <div className={styles["container"]}>
            
            <img src={img} alt=""/>
            <div className={styles["content-grouping"]}>
                {gameTitle && <span className={styles.gameTitle}>{gameTitle}</span>}
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.des}>{des}</p>
                {warning && <p className={styles.warning}>{warning}</p>}
                <Link to={ctaLink} className={styles.cta}>{ctaText}</Link>
            </div>
        </div>
    )
}

export default Hero;