import { useEffect, useRef, useState } from "react";
import styles from '../css/store.module.css';
import Header from "../components/Header";
import Hero from '../components/store/Hero';
import HeroTargeter from '../components/store/HeroTargeter';

function Store() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const cycle = () => setActiveIndex(prev => (prev + 1) % 5);
    timeoutRef.current = setInterval(cycle, 10000);
    return () => clearInterval(timeoutRef.current);
  }, []);

  const handleManualSwitch = index => {
    setActiveIndex(index);
    clearInterval(timeoutRef.current);
    timeoutRef.current = setInterval(() => setActiveIndex(prev => (prev + 1) % 5), 10000);
  };

  return (
    <main>
      <section className={styles.hero}>
        
        <div className={styles["target-items"]}>
          <div className={styles.gradient}></div>
          <Header title="Store"/>
          {activeIndex === 0 && <Hero img="/public/store/anno-117.jpg" title="Pre-order Anno-117: Pax Romana" des="Get 20% off when you redeem 100 GridSync Points" ctaLink="/" ctaText="Pre-order" warning="Learn more about our loyalty program and Points here. Terms and conditions apply." />}
          {activeIndex === 1 && <Hero img="/public/store/deal.avif" title="Up to 85% off" des="Earn points with any puchase from the GridSync Store" ctaLink="/" ctaText="Shop now" warning="Conditions apply. Valid on select titles until June 17, 2025 at 10 AM UTC." />}
          {activeIndex === 2 && <Hero img="/public/store/the-division-2.jpg" title="Your ticket to Washinton, D.C. for $3" des="Play The Division 2 to fight the chaos and lead the resistance." ctaLink="/" ctaText="Shop now" warning="Conditions apply. Valid on select titles until June 17, 2025 at 10 AM UTC." />}
          {activeIndex === 3 && <Hero img="/public/store/rainbow-six-siege.jpg" title="Rainbow Six Siege X: Coming June 10th 2025" des="Get Rainbow Six Siege before Siege X launches to keep all modes including Ranked, progression, and operators!" ctaLink="/" ctaText="Learn more" />}
          {activeIndex === 4 && <Hero img="/public/store/100plus-games.jpg" title="100+ games, worlds. Explore them all with GridSync+" des="All of our games, in their most premium editions." ctaLink="/" ctaText="Join now" />}
          <div className={styles["carousel-tracker"]}>
            <button className={`${styles.dot} ${activeIndex === 0 ? styles.active : ""}`} onClick={() => handleManualSwitch(0)}></button>
            <button className={`${styles.dot} ${activeIndex === 1 ? styles.active : ""}`} onClick={() => handleManualSwitch(1)}></button>
            <button className={`${styles.dot} ${activeIndex === 2 ? styles.active : ""}`} onClick={() => handleManualSwitch(2)}></button>
            <button className={`${styles.dot} ${activeIndex === 3 ? styles.active : ""}`} onClick={() => handleManualSwitch(3)}></button>
            <button className={`${styles.dot} ${activeIndex === 4 ? styles.active : ""}`} onClick={() => handleManualSwitch(4)}></button>
          </div>
        </div>

        <div className={styles["target-container"]}>
          <HeroTargeter img="/public/store/anno-117.jpg" title="Pre-order Anno-117: Pax Romana" onClick={() => handleManualSwitch(0)} className={activeIndex === 0 ? styles.active : ""} />
          <HeroTargeter img="/public/store/deal.avif" title="Up to 85% off" des="Earn points with any puchase from the GridSync Store" onClick={() => handleManualSwitch(1)} className={activeIndex === 1 ? styles.active : ""} />
          <HeroTargeter img="/public/store/the-division-2.jpg" title="Your ticket to Washinton, D.C. for $3" onClick={() => handleManualSwitch(2)} className={activeIndex === 2 ? styles.active : ""} />
          <HeroTargeter img="/public/store/rainbow-six-siege.jpg" title="Rainbow Six Siege X: Coming June 10th 2025" onClick={() => handleManualSwitch(3)} className={activeIndex === 3 ? styles.active : ""} />
          <HeroTargeter img="/public/store/100plus-games.jpg" title="100+ games, worlds. Explore them all with GridSync+" onClick={() => handleManualSwitch(4)} className={activeIndex === 4 ? styles.active : ""} />
        </div>
      </section>
    </main>
  )
}

export default Store;
