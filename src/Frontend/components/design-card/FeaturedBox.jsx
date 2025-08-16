import styles from '../../css/components-css/design-card-css/featuredBox.module.css';
import { Link } from "react-router";

function FeaturedBox ({img, imgText, title, src}) {
    return (
        <Link to={src} className={styles.container}>
            <div className={styles.imgRelative}>
                <img src={img} alt="" width="300.8" height="200" />
                {imgText && <span className={styles.imgText}>{imgText}</span>}
                <div className={styles.gradient}></div>
            </div>
            <div className={styles.info}>
                <h3>{title}</h3>
            </div>
        </Link>
    )
}

export default FeaturedBox;