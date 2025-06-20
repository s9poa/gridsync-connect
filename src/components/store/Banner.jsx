import styles from "./banner.module.css";
import { Link } from "react-router";

function Banner ({img, highlight, title, des, src, linkText}) {
    return (
        <div className={styles.container}>
            <img src={img} alt="" />
            <span>{highlight}</span>
            <h3>{title}</h3>
            <p>{des}</p>
            <Link to="/subscribe">{linkText}</Link>
        </div>
    )
}

export default Banner;