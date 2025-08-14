import styles from '../../css/components-css/hero-css/hero-targeter.module.css';

function HeroTargeter({ img, title, onClick, className }) {
  return (
    <button className={`${styles.container} ${className || ""}`} onClick={onClick}>
      <img src={img} alt="" width="300.8" height="169.19" />
      <h3>{title}</h3>
    </button>
  )
}

export default HeroTargeter;
