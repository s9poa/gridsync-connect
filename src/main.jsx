import './global-css/universal.css';
import './assets/fontawesome/css/all.min.css';

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import { getUserWithProfile } from './utils/auth';

import Home from './directory/Home.jsx';
import LeftSidebar from './sidebar/LeftSidebar.jsx';
import RightSidebar from './sidebar/RightSidebar.jsx';

function MainApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const checkSession = async () => {
      const userData = await getUserWithProfile();
      if (userData) setUser(userData);
      setLoading(false); // ✅ done checking session
    };
    checkSession();
  }, []);

  if (loading) return null; // ⏳ Don't render anything yet

  return (
    <div id="main-layout">
      <BrowserRouter>
        <LeftSidebar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <RightSidebar />
      </BrowserRouter>
    </div>
  );
}



createRoot(document.getElementById('root')).render(<MainApp />);
