import './global-css/universal.css';
import './assets/fontawesome/css/all.min.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";

import Home from './directory/Home.jsx';
import LeftSidebar from './sidebar/LeftSidebar.jsx';
import RightSidebar from './sidebar/RightSidebar.jsx';

createRoot(document.getElementById('root')).render(
    <div id="main-layout">
    <BrowserRouter>
      <LeftSidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
      <RightSidebar />
    </BrowserRouter>
    </div>
);
