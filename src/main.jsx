import './Frontend/css/global-css/universal.css';
import './assets/fontawesome/css/all.min.css';

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
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
