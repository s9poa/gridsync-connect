import styles from '../../css/components-css/design-card-css/browsing-box.module.css';
import { Link } from 'react-router';

function BrowsingBox ({title, src, img}) {
    return (
        <Link to={src} className={`${styles["container"]} main-content-child animate-onView`}>
            <h3>{title}</h3>
            <img src={img} alt="" />
        </Link>
    )
}

export default BrowsingBox;