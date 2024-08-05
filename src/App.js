import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import mixpanel from 'mixpanel-browser';
import Portfolio from './Portfolio';
import Skills from './Skills';
import Contact from './Contact';
import Resume from './Resume';
import Education from './Education';
import Projects from './Projects';
import DarkModeToggle from './DarkModeToggle';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    mixpanel.init('49eb6ef75e33925ec14c7a6724df3c6d');
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Router>
        <Analytics />
        <Routes>
          <Route path="/" element={<Portfolio darkMode={darkMode} />} />
          <Route path="/skills" element={<Skills darkMode={darkMode} />} />
          <Route path="/contact" element={<Contact darkMode={darkMode} />} />
          <Route path="/resume" element={<Resume darkMode={darkMode} />} />
          <Route path="/education" element={<Education darkMode={darkMode} />} />
          <Route path="/projects" element={<Projects darkMode={darkMode} />} />
        </Routes>
      </Router>
    </div>
  );
}