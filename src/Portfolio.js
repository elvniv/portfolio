import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import NavigationBar from './NavigationBar';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false);
  const [typedHeading, setTypedHeading] = useState('');
  const [typedSubheading, setTypedSubheading] = useState('');

  const heading = "Elvin Atwine";
  const subheading = "Founder, Designer, Developer";

  const experiences = [
    {
      company: "Klorah",
      role: "Founder & CEO",
      period: "Sep 2023 - Present",
      description: "Bringing traditional job benefits to freelancers."
    },
    {
      company: "Kaiya",
      role: "UX & Product Design",
      period: "Nov 2021 - Apr 2022",
      description: "Designed user-centric solutions for a remote-first company."
    },
    {
      company: "Iveyy Clothing",
      role: "Founder & CEO",
      period: "May 2019 - Mar 2021",
      description: "Launched an e-commerce clothing brand at age 16."
    }
  ];

  useEffect(() => {
    const typeText = (text, setter, delay = 50) => {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setter(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, delay);
    };

    typeText(heading, setTypedHeading);
    setTimeout(() => typeText(subheading, setTypedSubheading, 30), heading.length * 50);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} transition-colors duration-300 ease-in-out`}>
      <NavigationBar darkMode={darkMode} />
      <div className="container mx-auto px-4 py-12">
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            {typedHeading}
          </h1>
          <p className={`text-2xl md:text-3xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {typedSubheading}
          </p>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {experiences.map((exp, index) => (
            <motion.div 
              key={index} 
              className={`bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 ${darkMode ? 'bg-white' : 'bg-black'}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-bold mb-2">{exp.company}</h2>
              <h3 className="text-xl mb-2">{exp.role}</h3>
              <p className="text-sm mb-4">{exp.period}</p>
              <p>{exp.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">Education</h2>
          <p className="text-xl">University of Connecticut</p>
          <p>Bachelor's degree in Business Management</p>
          <p>Expected graduation: May 2027</p>
        </motion.div>

        <motion.div 
          className="flex justify-center space-x-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={30} />
          </a>
          <a href="https://github.com/elvniv" target="_blank" rel="noopener noreferrer">
            <FaGithub size={30} />
          </a>
          <a href="mailto:your.email@example.com">
            <FaEnvelope size={30} />
          </a>
        </motion.div>
      </div>

      <div className="fixed bottom-8 left-8 z-10">
        <Switch
          checked={darkMode}
          onChange={toggleDarkMode}
          className={`relative inline-flex items-center h-8 rounded-full w-16 transition-colors duration-200 ease-in-out ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <span className={`block w-6 h-6 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${darkMode ? 'translate-x-9' : 'translate-x-1'}`}>
            {darkMode ? '🌙' : '☀️'}
          </span>
        </Switch>
      </div>
    </div>
  );
}