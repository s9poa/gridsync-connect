import styles from '../css/subscribe.module.css';
import Header from "../components/Header";
import PaymentCard from '../components/subscribe/PaymentCard';
import { Link } from 'react-router';

function Subscribe() {

  return (
    <main>
      <Header title="Subscribe"/>

      <section className="main-content-section">
        <div className={styles.paymentHeader}>
          <h2>Choose your plan</h2>
          <p>Switch or cancel anytime</p>
          <p>Effective at the end of the billing period</p>
        </div>
        <div className={`${styles.cardGrid} main-content-section-grid grid-2`}>
          <PaymentCard title="Classics" des="Play a selection of iconic games on PC" cost="7.99" list1="Play an evolving selection of games on PC" list2="Access to standard editions" list3="20% discount on games included in your plan" />
          <PaymentCard title="Premium" des="Play most premium editions from Day 1" cost="17.99" list1="Play 100+ games on PC" list2="New releases Day 1 & early access when available" list3="Most premium editions and DLC content" list4="20% discount on games and DLCs, 10% off virtual currencies" list5="Monthly game rewards" list6="Play on Cloud with Luna" list7="Play on Xbox"/>
        </div>
      </section>

      <section className="main-content-section">
        <h2 className="main-content-section-title">Frequently asked questions <Link to="/store">See all FAQ</Link></h2>
        <div className={styles.faqContainer}>
          <details>
            <summary>What is GridSync Connect?</summary>
            <p>GridSync Connect is a web-based platform where users can browse, save, and manage their favorite games.</p>
          </details>
          <details>
            <summary>What games and in-game content will I have access to with the GridSync+ Premium subscription?</summary>
            <p>With GridSync+ Premium, you'll unlock full access to a rotating library of top-tier titles across genres, exclusive in-game content, early access to upcoming releases, and special rewards that are only available to Premium members.</p>
          </details>
          <details>
            <summary>What is GridSync+ Classics?</summary>
            <p>GridSync+ Classics is a curated collection of legendary titles from past generations, brought back with modern enhancements. It's perfect for players who want to revisit iconic games or experience them for the first time — all included with your subscription.</p>
          </details>
          <details>
            <summary>Which offer includes Xbox access?</summary>
            <p>The GridSync+ Premium + Console bundle includes Xbox access, allowing you to play select titles across both PC and console with synced progress and cloud saves.</p>
          </details>
          <details>
            <summary>What happens if I unsubscribe?</summary>
            <p>If you unsubscribe, you'll lose access to the Premium library, exclusive content, and any ongoing perks tied to your subscription. However, your saved data and owned purchases will remain in your account for whenever you return.</p>
          </details>
        </div>
      </section>

    </main>
  )
}

export default Subscribe;
