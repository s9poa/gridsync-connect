import styles from './favorited-game.module.css';

function FavoritedGame({ id, img, title, onRemove }) {
  const handleClick = () => onRemove(id);

  return (
    <div className={styles.container}>
      <img src={img} alt="" />
      <div>
        <h3>{title}</h3>
        <button className={styles["remove-favorited"]} onClick={handleClick}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#ffffff" stroke="#ffffff" strokeWidth="60">
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default FavoritedGame;
