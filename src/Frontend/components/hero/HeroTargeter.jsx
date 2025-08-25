import styles from '../../css/components-css/hero-css/hero-targeter.module.css';

function HeroTargeter({ img, title, onClick, className }) {
  return (
    <button className={`${styles.container} ${className || ""} ${className}`} onClick={onClick}>
      <h3>{title}</h3>
    </button>
  )
}

export default HeroTargeter;
