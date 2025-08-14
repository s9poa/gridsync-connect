import styles from '../../css/sidebar-css/right-sidebar-css/user.module.css';

function User({ img, username, title, canAdd = false, canRemove = false, onAddClick, onRemoveClick }) {
  return (
    <div className={styles.container}>
      <div><img src={img} alt="" width="40" height="40" /><div><h4>{username}</h4><p>{title}</p></div></div>
      <div>
        {canAdd && <button className={styles["add-user-to-friends"]} title="Add to Friends" onClick={onAddClick}><i className="fa-solid fa-plus" aria-hidden="true"></i></button>}
        {canRemove && <button className={styles["remove-user-from-friends"]} title="Remove from Friends" onClick={onRemoveClick}><i className="fa-solid fa-minus" aria-hidden="true"></i></button>}
      </div>
    </div>
  );
}

export default User;
