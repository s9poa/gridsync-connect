import './Frontend/css/global-css/universal.css';
import './assets/fontawesome/css/all.min.css';

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { getUserWithProfile } from './Backend/utils/auth.js';

import Home from './Frontend/directory/Home.jsx';
import Library from './Frontend/directory/Library.jsx';
import Store from './Frontend/directory/Store.jsx';
import Subscribe from './Frontend/directory/Subscribe.jsx';
import LeftSidebar from './Frontend/sidebar/LeftSidebar.jsx';
import RightSidebar from './Frontend/sidebar/RightSidebar.jsx';
import Account from './Frontend/directory/Account.jsx';
import Confirm from './Frontend/directory/Confirm.jsx';

import ScrollToTop from './ScrollToTop.jsx';

function AnimateOnViewHandler() {
  const location = useLocation();

  useEffect(() => {
    const elements = document.querySelectorAll(".animate-onView");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.visibility = "visible";
            entry.target.style.animation = "onView .275s alternate";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.0005 }
    );

    elements.forEach(el => {
      el.style.visibility = "hidden";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
}

function MainApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const userData = await getUserWithProfile();
      if (userData) setUser(userData);
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) return null;

  return (
    <div id="main-layout">
      <BrowserRouter>
        <ScrollToTop />
        <AnimateOnViewHandler />
        <LeftSidebar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library user={user} />} />
          <Route path="/store" element={<Store user={user} />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/account" element={<Account user={user} setUser={setUser} />} />
          <Route path="/confirm-validation-success" element={<Confirm setUser={setUser} />} />
        </Routes>
        <RightSidebar user={user} />
      </BrowserRouter>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<MainApp />);
