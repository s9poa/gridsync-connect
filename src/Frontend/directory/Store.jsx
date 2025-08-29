import { useEffect, useRef, useState } from "react";
import styles from '../css/directory-css/store.module.css';
import Header from "../components/header-and-footer/Header";
import Hero from '../components/hero/Hero';
import HeroTargeter from '../components/hero/HeroTargeter';
import LandscapeGameItem from "../components/design-card/LandscapeGameItem";
import PortraitGameItem from "../components/design-card/PortraitGameItem";
import SuccessFormMessage from "../components/form/SuccessFormMessage";
import ErrorFormMessage from "../components/form/ErrorFormMessage";
import Banner from "../components/design-card/Banner";
import BoxyGameItem from "../components/design-card/BoxyGameItem";
import BrowsingBox from "../components/design-card/BrowsingBox";
import Footer from "../components/header-and-footer/Footer";

function Store({ user }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("Added to Favorites.");
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

  const triggerSuccess = (msg = "Added to Favorites.") => {
    setSuccessMsg(msg);
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
          <Header className={styles.header} title="Store"/>
          
          {activeIndex === 0 && <Hero className="storepage-rainbow-six-siege-banner-img homepage-banner-positioning" title="Rainbow Six Siege X is out!" des="Get Free Access now - Including operators, Unranked mode, Quick Play, and Dual Front" ctaLink="/" ctaText="Play now" />}
          {activeIndex === 1 && <Hero className="storepage-deal-banner-img homepage-banner-positioning" title="Up to 85% off" des="Earn points with any puchase from the GridSync Store" ctaLink="/" ctaText="Shop now" warning="Conditions apply. Valid on select titles until June 17, 2025 at 10 AM UTC." />}
          {activeIndex === 2 && <Hero className="storepage-the-division-2-banner-img homepage-banner-positioning" title="Your ticket to Washinton, D.C. for $3" des="Play The Division 2 to fight the chaos and lead the resistance." ctaLink="/" ctaText="Shop now" warning="Conditions apply. Valid on select titles until June 17, 2025 at 10 AM UTC." />}
          {activeIndex === 3 && <Hero className="storepage-anno-117-banner-img homepage-banner-positioning" title="Pre-order Anno-117: Pax Romana" des="Get 20% off when you redeem 100 GridSync Points" ctaLink="/" ctaText="Pre-order" warning="Learn more about our loyalty program and Points here. Terms and conditions apply." />}
          {activeIndex === 4 && <Hero className="storepage-100plus-games-banner-img homepage-banner-positioning" title="100+ games, worlds. Explore them all with GridSync+" des="All of our games, in their most premium editions." ctaLink="/" ctaText="Join now" />}
          <div className={styles["carousel-tracker"]}>
            <button className={`${styles.dot} ${activeIndex === 0 ? styles.active : ""}`} onClick={() => handleManualSwitch(0)}></button>
            <button className={`${styles.dot} ${activeIndex === 1 ? styles.active : ""}`} onClick={() => handleManualSwitch(1)}></button>
            <button className={`${styles.dot} ${activeIndex === 2 ? styles.active : ""}`} onClick={() => handleManualSwitch(2)}></button>
            <button className={`${styles.dot} ${activeIndex === 3 ? styles.active : ""}`} onClick={() => handleManualSwitch(3)}></button>
            <button className={`${styles.dot} ${activeIndex === 4 ? styles.active : ""}`} onClick={() => handleManualSwitch(4)}></button>
          </div>
        </div>
        <div className={styles.gradientSizingContainer}>
          <div className={styles["target-container"]}>
            <HeroTargeter className={`storepage-rainbow-six-siege-herotargeter-img herotargeter-positioning ${activeIndex === 0 ? styles.active : ""}`} title="Rainbow Six Siege X: Coming June 10th 2025" onClick={() => handleManualSwitch(0)} />
            <HeroTargeter className={`storepage-deal-herotargeter-img herotargeter-positioning ${activeIndex === 1 ? styles.active : ""}`} title="Up to 85% off" des="Earn points with any puchase from the GridSync Store" onClick={() => handleManualSwitch(1)} />
            <HeroTargeter className={`storepage-the-division-2-herotargeter-img herotargeter-positioning ${activeIndex === 2 ? styles.active : ""}`} title="Your ticket to Washinton, D.C. for $3" onClick={() => handleManualSwitch(2)} />
            <HeroTargeter className={`storepage-anno-117-herotargeter-img herotargeter-positioning ${activeIndex === 3 ? styles.active : ""}`} title="Pre-order Anno-117: Pax Romana" onClick={() => handleManualSwitch(3)} />
            <HeroTargeter className={`storepage-100plus-games-herotargeter-img herotargeter-positioning ${activeIndex === 4 ? styles.active : ""}`} title="100+ games, worlds. Explore them all with GridSync+" onClick={() => handleManualSwitch(4)} />
          </div>
          <div className={styles.mainVisualGradient}></div>
        </div>
      </section>

      <section className="main-content-section">
        <h2 className="main-content-section-title">Play the new season now</h2>
        <div className="main-content-section-grid grid-4">
          <LandscapeGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/siege-x-free-access.webp" tag="New" title="Tom Clancy's Rainbow Six Siege X" des="Free Access" price="Free"/>
          <LandscapeGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/siege-x-elite-edition.webp" tag="New" title="Tom Clancy's Rainbow Six Siege X" des="Elite Edition" price="$19.99"/>
          <LandscapeGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/siege-x-pack.webp" title="Tom Clancy's Rainbow Six Siege - Siege X Pack" des="Siege X Pack" price="$39.99"/>
          <LandscapeGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/siege-credits.webp" title="Tom Clancy's Rainbow Six Siege - 1,200 R6 Credits" des="1,200 R6 Credits" price="$9.99"/>
        </div>
      </section>

      <section className="main-content-section">
        <h2 className="main-content-section-title">Save big, play big</h2>
        <div className="main-content-section-grid grid-5">
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/portrait-the-division-2.webp" title="Tom Clancy's Rainbow Six Siege X" des="Standard Edition" discount="-90%" previousPrice="$29.99" price="$3.00"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/portrait-anno-1800.webp" title="Anno 1800" des="Standard Edition" discount="-75%" previousPrice="$59.99" price="$15.00"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/portrait-assassins-creed-mirage.webp" title="Assassin's Creed Mirage" des="Standard Edition" discount="-60%" previousPrice="$39.99" price="$20.00"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/portrait-star-wars-outlaws.webp" title="Star Wars Outlaws" des="Standard Edition" discount="-50%" previousPrice="$69.99" price="$34.99"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/portrait-breakpoint.webp" title="Tom Clancy's Ghost Recon Breakpoint" des="Standard Edition" discount="-80%" previousPrice="$59.99" price="$12.00"/>
        </div>
      </section>

      <section className="main-content-section">
        <Banner img="/gridsync-banner.webp" highlight="GridSync +" title="One world is never enough" des="Enjoy titles you love, discover new favourites with GridSync+" linkText="Join now"/>
      </section>
      
      <section className="main-content-section">
        <h2 className="main-content-section-title">Visit GridSync's universes</h2>
        <div className="main-content-section-grid grid-6">
          <BoxyGameItem img="/store/banner-ac.jpg" title="Assassin's Creed 2"/>
          <BoxyGameItem img="/store/banner-rainbow-six.webp" title="Rainbow Six"/>
          <BoxyGameItem img="/store/farcry.webp" title="Far Cry 6"/>
          <BoxyGameItem img="/store/watch-dogs.webp" title="Watch Dogs"/>
          <BoxyGameItem img="/store/for-honor.webp" title="For Honor"/>
          <BoxyGameItem img="/store/portrait-breakpoint.webp" title="The Division"/>
        </div>
      </section>

      <section className="main-content-section">
        <h2 className="main-content-section-title">Games to discover</h2>
        <div className="main-content-section-grid grid-5">
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/the-witcher-3.webp" title="The Witcher 3" des="Free to Play" price="Free"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/mario-kart.webp" title="Mario Kart" des="Free to Play" price="Free"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/modern-warfare-3.webp" title="Modern Warfare 3" des="Free to Play" price="Free"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/minecraft.webp" title="Minecraft" des="Free to Play" price="Free"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/league-of-legends.webp" title="League of Legends" des="Free to Play" price="Free"/>
        </div>
      </section>

      <section className="main-content-section">
        <h2 className="main-content-section-title">Must-have DLCs</h2>
        <div className="main-content-section-grid grid-5">
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/bedlam-pack.webp" title="Tom Clancy's The Division 2 - Bedlam Pack" des="Bedlam Pack" price="$19.99"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/pirates-fortune.webp" title="Star Wars Outlaws - A Pirate's Fortune" des="A Pirate's Fortune" price="$14.99"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/captain-coalheart.webp" title="For Honor - Captain Coalheart - Pirate Hero Skin" des="Captain CoalHeart - Pirate Hero Skin" price="$11.99"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/ac-starter-pack.webp" title="Assassin's Creed Shadows - Premium Starter Pack" des="Premium Starter Pack" price="$34.99"/>
          <PortraitGameItem user={user} onSuccess={triggerSuccess} onError={triggerError} img="/store/seasonal-boatload.webp" title="Skull and Bones Seasonal Boatload" des="Seasonal Boatload" price="$59.99"/>
        </div>
      </section>

      <section className="main-content-section browsingBox">
        <h2 className="main-content-section-title">Browse</h2>
        <div className="main-content-section-grid grid-3 browse">
          <BrowsingBox title="GridSync+" img="/store/gridsync+.webp"/>
          <BrowsingBox title="Best Sellers" img="/store/sellers.webp"/>
          <BrowsingBox title="Latest Releases" img="/store/acsh-browse-card-character.webp"/>
        </div>
      </section>

      <Footer />

      {showSuccess && <div className={styles["msg-prompt"]}><SuccessFormMessage des={successMsg} /></div>}
      {showError && <div className={styles["msg-prompt"]}><ErrorFormMessage des="Error. Something went wrong." /></div>}
    </main>
  );
}

export default Store;
