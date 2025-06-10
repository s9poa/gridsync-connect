import './global-css/universal.css';
import './assets/fontawesome/css/all.min.css';

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import { getUserWithProfile } from './utils/auth';

import Home from './directory/Home.jsx';
import Library from './directory/Library.jsx';
import Store from './directory/Store.jsx';
import Subscribe from './directory/Subscribe.jsx';
import LeftSidebar from './sidebar/LeftSidebar.jsx';
import RightSidebar from './sidebar/RightSidebar.jsx';
import Account from './directory/Account.jsx'; // Make sure this is the correct import path

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
        <LeftSidebar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/store" element={<Store />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/account" element={<Account user={user} setUser={setUser} />} />
        </Routes>
        <RightSidebar />
      </BrowserRouter>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<MainApp />);
