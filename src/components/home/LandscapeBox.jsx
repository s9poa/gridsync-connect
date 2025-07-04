import styles from './landscapeBox.module.css';
import { Link } from 'react-router';

function LandscapeBox({ link, img, tag, title, des, price, cta, subTitle,date }) {

  return (
    <Link to={link} className={`${styles["container"]} main-content-child`}>
      <img src={img} className={styles.img} alt="" />
      <div>
        {tag && <span className={styles.tag}>{tag}</span>}
        {subTitle && <span className={styles.subTitle}>{subTitle}</span>}
        <h3 className={styles.title}>{title}</h3>
        {des && <p className={styles.des}>{des}</p>}
        {price && <span className={styles.price}>{price}</span>}
        {cta && <button className={styles.cta}>{cta}</button>}
        {date && <span className={styles.date}>{date}</span>}
      </div>
    </Link>
  );
}

export default LandscapeBox;
