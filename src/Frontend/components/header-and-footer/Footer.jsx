import styles from "../../css/components-css/header-and-footer-css/Footer.module.css";
import { Link } from "react-router";

function Footer () {
    return (
        <div className={styles.footer}>
            <p>Looking for the latest PC video games? Look no further than the GridSync Store! Enjoy the ultimate gaming experience with new games, season pass and more additional content from the GridSync Store. With regular sales and special offers, you can score great deals on video games from GridSync's top franchises such as Assassin's Creed, Far Cry, Anno and more.</p>
            <nav>
                <Link to="/store">Terms of Use</Link>
                <i className="fa-solid fa-circle" aria-hidden="true"></i>
                <Link to="/store">Privacy Policy</Link>
                <i className="fa-solid fa-circle" aria-hidden="true"></i>
                <Link to="/store">Set Cookies</Link>
                <i className="fa-solid fa-circle" aria-hidden="true"></i>
                <Link to="/store">Do not sell my personal info</Link>
                <i className="fa-solid fa-circle" aria-hidden="true"></i>
                <Link to="/store">Interest-Based Advertising</Link>
                <i className="fa-solid fa-circle" aria-hidden="true"></i>
                <Link to="/store">Legal Notice</Link>
                <i className="fa-solid fa-circle" aria-hidden="true"></i>
                <Link to="/store">Terms of Sale</Link>
                <i className="fa-solid fa-circle" aria-hidden="true"></i>
                <Link to="/store">Refund Policy</Link>
            </nav>
            <p className={styles.copyright}>© 2025 GridSync Entertainment. All Rights Reserved. GridSync and the GridSync logo are trademarks of GridSync Entertainment in the U.S. and/or other countries</p>
        </div>
    )
}

export default Footer;