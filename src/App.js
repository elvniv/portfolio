import React, { useEffect } from 'react';
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
          <Route path="/" element={<Portfolio />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/education" element={<Education />} />
          <Route path="/projects" element={<Projects />} />




        </Routes>
      </Router>
    </div>
  );
}
