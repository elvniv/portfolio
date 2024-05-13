import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import mixpanel from 'mixpanel-browser';
import SearchPage from './SearchPage';



export default function App() {
  useEffect(() => {
    mixpanel.init('49eb6ef75e33925ec14c7a6724df3c6d');
  }, []);

  return (
    <div>
      <Router>
        <Analytics />
        {/* <AutoLogin /> */}
        <Routes>
          {/* authenitcation */}
          <Route path="/" element={<SearchPage />} />

        </Routes>
      </Router>
    </div>
  );
}
