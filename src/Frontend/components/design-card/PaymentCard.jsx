import styles from '../../css/components-css/design-card-css/payment-card.module.css';

function PaymentCard ({title, des, cost, list1, list2, list3, list4, list5, list6, list7}) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>{title}</h3>
                <p>{des}</p>
            </div>
            {cost && <p className={styles.cost}>${cost}<span>/month</span></p>}
            <div className={styles.ctaGrouping}>
                <button className={styles.targeted}>Choose this plan</button>
                <button className={styles.untargeted}>See games included</button>
            </div>
            <ul className={styles.listing}>
                {list1 && <li><i className="fa-solid fa-check" aria-hidden="true"></i>{list1}</li>}
                {list2 && <li><i className="fa-solid fa-check" aria-hidden="true"></i>{list2}</li>}
                {list3 && <li><i className="fa-solid fa-check" aria-hidden="true"></i>{list3}</li>}
                {list4 && <li><i className="fa-solid fa-check" aria-hidden="true"></i>{list4}</li>}
                {list5 && <li><i className="fa-solid fa-check" aria-hidden="true"></i>{list5}</li>}
                {list6 && <li><i className="fa-solid fa-check" aria-hidden="true"></i>{list6}</li>}
                {list7 && <li><i className="fa-solid fa-check" aria-hidden="true"></i>{list7}</li>}
            </ul>
        </div>
    )
}

export default PaymentCard;