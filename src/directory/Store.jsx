import { useEffect, useRef, useState } from "react";
import styles from '../css/store.module.css';
import Header from "../components/Header";
import Hero from '../components/store/Hero';
import HeroTargeter from '../components/store/HeroTargeter';
import LandscapeGameItem from "../components/store/LandscapeGameItem";
import PortraitGameItem from "../components/store/PortraitGameItem";
import SuccessFormMessage from "../components/SuccessFormMessage";
import ErrorFormMessage from "../components/ErrorFormMessage";

function Store({ user }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
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

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const triggerError = () => {
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
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
          {activeIndex === 3 && <Hero img="/public/store/rainbow-six-siege.jpg" title="Rainbow Six Siege X is out!" des="Get Free Access now - Including operators, Unranked mode, Quick Play, and Dual Front" ctaLink="/" ctaText="Play now" />}
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

      <section className="main-content-section">
        <h2 className="main-content-section-title">Play the new season now</h2>
        <div className="main-content-section-grid grid-4">
          <LandscapeGameItem img="/public/store/siege-x-free-access.webp" tag="New" title="Tom Clancy's Rainbow Six Siege X" des="Free Access" price="Free"/>
          <LandscapeGameItem img="/public/store/siege-x-elite-edition.webp" tag="New" title="Tom Clancy's Rainbow Six Siege X" des="Elite Edition" price="$19.99"/>
          <LandscapeGameItem img="/public/store/siege-x-pack.webp" title="Tom Clancy's Rainbow Six Siege - Siege X Pack" des="Siege X Pack" price="$39.99"/>
          <LandscapeGameItem img="/public/store/siege-credits.webp" title="Tom Clancy's Rainbow Six Siege - 1,200 R6 Credits" des="1,200 R6 Credits" price="$9.99"/>
        </div>
      </section>

      <section className="main-content-section">
        <h2 className="main-content-section-title">Save big, play big</h2>
        <div className="main-content-section-grid grid-6">
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/public/store/portrait-the-division-2.webp" title="Tom Clancy's Rainbow Six Siege X" des="Standard Edition" discount="-90%" previousPrice="$29.99" price="$3.00"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/public/store/portrait-anno-1800.jpg" title="Anno 1800" des="Standard Edition" discount="-75%" previousPrice="$59.99" price="$15.00"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/public/store/portrait-assassins-creed-mirage.jpeg" title="Assassin's Creed Mirage" des="Standard Edition" discount="-60%" previousPrice="$39.99" price="$20.00"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/public/store/portrait-star-wars-outlaws.jpg" title="Star Wars Outlaws" des="Standard Edition" discount="-50%" previousPrice="$69.99" price="$34.99"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/public/store/portrait-breakpoint.avif" title="Tom Clancy's Ghost Recon Breakpoint" des="Standard Edition" discount="-80%" previousPrice="$59.99" price="$12.00"/>
        </div>
      </section>

      {showSuccess && <div className={styles["msg-prompt"]}><SuccessFormMessage des="Added to Favorites." /></div>}
      {showError && <div className={styles["msg-prompt"]}><ErrorFormMessage des="Error. Something went wrong." /></div>}
    </main>
  )
}

export default Store;
