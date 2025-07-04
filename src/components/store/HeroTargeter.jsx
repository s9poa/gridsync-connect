import styles from '../../css/store/hero-targeter.module.css';

function HeroTargeter({ img, title, onClick, className }) {
  return (
    <button className={`${styles.container} ${className || ""}`} onClick={onClick}>
      <img src={img} alt="" width="300.8" height="169.19" />
      <div>
        <h3>{title}</h3>
      </div>
    </button>
  )
}

export default HeroTargeter;
