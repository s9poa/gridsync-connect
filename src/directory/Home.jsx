import styles from '../css/home.module.css';
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/store/Hero";
import HeroTargeter from "../components/store/HeroTargeter";
import { Link } from 'react-router';
import FeaturedBox from '../components/home/FeaturedBox';
import LandscapeBox from '../components/home/LandscapeBox';
import Banner from '../components/store/Banner';
import Footer from '../components/Footer';

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const cycle = () => setActiveIndex(prev => (prev + 1) % 4);
    timeoutRef.current = setInterval(cycle, 10000);
    return () => clearInterval(timeoutRef.current);
  }, []);

  const handleManualSwitch = index => {
    setActiveIndex(index);
    clearInterval(timeoutRef.current);
    timeoutRef.current = setInterval(() => setActiveIndex(prev => (prev + 1) % 4), 10000);
  };

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles["target-items"]}>
          <div className={styles.gradient}></div>
          <Header className={styles.header} title="Home"/>
          
          {activeIndex === 0 && <Hero img="/home/far-cry-6.webp" gameTitle ="Far Cry 6" title="Ready for Your Next Adventure?" des="Discover Fary Cry 6 and take down the tyrannical dictaor Anton Castillo." ctaLink="/" ctaText="Play now" />}
          {activeIndex === 1 && <Hero img="/home/ac-shadows.webp" gameTitle ="Assassin's Creed Shadows" title="Save 25% on Assassin's Creed Shadows" des="Plus, get an extra 20% off your cart when you redeem 100 GridSync Points!" ctaLink="/" ctaText="Get the game" />}
          {activeIndex === 2 && <Hero img="/home/r6.webp" gameTitle ="Rainbow Six Siege" title="Get free access to Siege X now!" des="Engage in intense 5v5 attack vs defense matches where elite strategy execution triumph." ctaLink="/" ctaText="Play now" />}
          {activeIndex === 3 && <Hero img="/home/ac-mirage.webp" gameTitle ="Assassin's Creed Mirage" title="Discover a Tribute to the Original" des="Experience a mordern take on the iconic features and gameplay that have defined a franchise for 15 years." ctaLink="/" ctaText="Get it now" />}
          <div className={styles["carousel-tracker"]}>
            <button className={`${styles.dot} ${activeIndex === 0 ? styles.active : ""}`} onClick={() => handleManualSwitch(0)}></button>
            <button className={`${styles.dot} ${activeIndex === 1 ? styles.active : ""}`} onClick={() => handleManualSwitch(1)}></button>
            <button className={`${styles.dot} ${activeIndex === 2 ? styles.active : ""}`} onClick={() => handleManualSwitch(2)}></button>
            <button className={`${styles.dot} ${activeIndex === 3 ? styles.active : ""}`} onClick={() => handleManualSwitch(3)}></button>
          </div>
        </div>
        <div className={styles.gradientSizingContainer}>
          <div className={styles["target-container"]}>
            <HeroTargeter img="/home/far-cry-6.webp" title="Ready for Your Next Adventure?" onClick={() => handleManualSwitch(0)} className={activeIndex === 0 ? styles.active : ""} />
            <HeroTargeter img="/home/ac-shadows.webp" gameTitle ="Assassin's Creed Shadows" title="Save 25% on Assassin's Creed Shadows" onClick={() => handleManualSwitch(1)} className={activeIndex === 1 ? styles.active : ""} />
            <HeroTargeter img="/home/r6.webp" title="Get free access to Siege X now!" onClick={() => handleManualSwitch(2)} className={activeIndex === 2 ? styles.active : ""} />
            <HeroTargeter img="/home/ac-mirage.webp" gameTitle="Assassin's Creed Mirage" title="Discover a Tribute to the Original" onClick={() => handleManualSwitch(3)} className={activeIndex === 3 ? styles.active : ""} />
          </div>
          <div className={styles.mainVisualGradient}></div>
        </div>
      </section>

      <section className="main-content-section vertical">
        <h2 className="main-content-section-title">Featured <Link to="/store">Visit GridSync Store</Link></h2>
        <div className="main-content-section-grid grid-2">
          <FeaturedBox img="/home/anno.webp" imgText="Pre-Order Anno 117: Pax Romana" tab="GridSync+" title="Get 20% off when you redeem 100 GridSync Points!" />
          <FeaturedBox img="/home/siege-pack.avif" imgText="Don't miss out!" tab="GridSync+" title="The Limited edition Siege X pack leaves our shop soon. Secure it now and flex it forever!" />
        </div>
      </section>

      <section className="main-content-section">
        <h2 className="main-content-section-title">Play for free <Link to="/store">View all</Link></h2>
        <div className="main-content-section-grid grid-3">
          <LandscapeBox img="/home/home-r6.webp" subTitle="Rainbow Six Siege X" title="Rainbow Six Siege X - Free Access" cta="Play now"/>
          <LandscapeBox img="/home/landscape-starwars-outlaws.webp" subTitle="Star Wars Outlaws" title="Star War Outlaws - Demo" cta="Play now"/>
          <LandscapeBox img="/home/brawlhalla.webp" subTitle="Brawlhalla" title="Brawlhalla - Free to play" cta="Play now"/>
        </div>
      </section>

      <section className="main-content-section">
        <Banner img="/home/home-r6-banner.webp" title="Siege the Advantage" des="Suit up with 50+ Operators, additional cosmetics and more when you play Rainbow Six Siege with GridSync+ Premium!" linkText="Subscribe now"/>
      </section>

      <section className="main-content-section">
        <h2 className="main-content-section-title">Latest news <Link to="/store">View all</Link></h2>
        <div className="main-content-section-grid grid-4">
          <LandscapeBox img="/home/trackmania.webp" subTitle="Trackmania" title="Summer Update 2025: Trackmania turns 5" date="3 days ago" />
          <LandscapeBox img="/home/r6-bundle.webp" subTitle="Rainbow Six Siege X" title="New R6 Share Pro Team Bundles Are Live" date="6 days ago" />
          <LandscapeBox img="/home/r6-showdown.webp" subTitle="Rainbow Six Siege X" title="New Twitch Drops For Siege X's Showdown Event" date="6 days ago" />
          <LandscapeBox img="/home/crew-june-24.webp" subTitle="The Crew Motorfest" title="This Week in The Crew - June 24" date="6 days ago" />
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Home;
