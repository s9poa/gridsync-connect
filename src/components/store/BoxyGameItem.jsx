import styles from "./boxy-game-item.module.css";
import { Link } from "react-router";

function BoxyGameItem ({src, img, title}) {
    return (
        <Link to={src} className={`${styles["container"]} main-content-child`}>
            <img src={img} alt=""/>
            <h3>{title}</h3>
        </Link>
    )
}

export default BoxyGameItem;