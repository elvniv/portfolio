import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import NavigationBar from './NavigationBar';

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [typedHeading, setTypedHeading] = useState('');
  const [typedSubheading, setTypedSubheading] = useState('');

  const headings = ["Elvin Atwine - Professional Journey"];
  const subheadings = ["Explore my career path and achievements."];

  const experiences = [
    {
      company: "Klorah",
      role: "Founder & CEO",
      period: "Sep 2023 - Present · 1 yr",
      description: "Klorah is a full approach at bringing traditional job comfort and benefits to the creative world of a freelancers' life."
    },
    {
      company: "Kaiya",
      role: "UX & Product Design",
      period: "Nov 2021 - Apr 2022 · 6 mos",
      description: "Remote. LinkedIn helped me get this job."
    },
    {
      company: "Day One",
      role: "Social Media Designer",
      period: "Aug 2021 - Nov 2021 · 4 mos",
      description: "New York, United States. Skills: Graphic Design, Adobe Photoshop, and more."
    },
    {
      company: "Freelance",
      role: "Athletic Photographer",
      period: "Jun 2019 - Apr 2021 · 1 yr 11 mos",
      description: "Lancaster, Pennsylvania, United States. I photographed various local athletes during their offseason training sessions."
    },
    {
      company: "Iveyy Clothing",
      role: "Founder & CEO",
      period: "May 2019 - Mar 2021 · 1 yr 11 mos",
      description: "Lancaster, Pennsylvania, United States. Lead a team of creative talent towards the launch of an e-commerce based clothing brand when I was 16 with no prior retail experience."
    }
  ];

  useEffect(() => {
    const changeTextInterval = setInterval(() => {
      setCurrentHeadingIndex((current) => (current + 1) % headings.length);
    }, 10000);

    return () => clearInterval(changeTextInterval);
  }, []);

  useEffect(() => {
    let typingTimer;
    const typeText = (text, setter, index = 0) => {
      setter(text.slice(0, index));
      if (index < text.length) {
        typingTimer = setTimeout(() => {
          typeText(text, setter, index + 1);
        }, 50);
      }
    };

    typeText(headings[currentHeadingIndex], setTypedHeading);
    typeText(subheadings[currentHeadingIndex], setTypedSubheading);

    return () => clearTimeout(typingTimer);
  }, [currentHeadingIndex]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const stars = 100;
    const starField = document.querySelector('.star-field');
    const existingStars = document.querySelectorAll('.star');
    existingStars.forEach(star => star.remove());

    for (let i = 0; i < stars; i++) {
      let star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.floor(Math.random() * 100)}vw`;
      star.style.top = `${Math.floor(Math.random() * 100)}vh`;
      star.style.animationDuration = `${Math.random() * 6 + 4}s`;
      star.style.backgroundColor = darkMode ? 'white' : 'black';
      starField.appendChild(star);
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} transition-colors duration-300 ease-in-out`}>
      <div className="sticky top-0 z-50">
        <NavigationBar darkMode={darkMode} />
      </div>
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            {typedHeading}
          </h1>
          <p className={`text-xl md:text-2xl animate-fade-in-delay ${darkMode ? 'text-white' : 'text-black'}`}>
            {typedSubheading}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <div key={index} className={`bg-white dark:bg-black rounded-lg shadow-lg p-6 transition-transform duration-300 hover:scale-105 ${darkMode ? 'hover:shadow-black/50' : 'hover:shadow-lg'}`}>
              <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">{exp.company}</h2>
              <h3 className="text-xl text-black dark:text-white mb-2">{exp.role}</h3>
              <p className="text-sm text-black dark:text-white mb-4">{exp.period}</p>
              <p className="text-black dark:text-white">{exp.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-4">Education</h2>
          <div className={`bg-white dark:bg-black rounded-lg shadow-lg p-6 transition-transform duration-300 hover:scale-105 ${darkMode ? 'hover:shadow-black/50' : 'hover:shadow-black/50'}`}>
            <h3 className="text-xl font-semibold text-black dark:text-white">University of Connecticut</h3>
            <p className="text-black dark:text-white">Bachelor's degree</p>
            <p className="text-black dark:text-white">Expected graduation: May 2027</p>
          </div>
          <div className={`bg-white dark:bg-black rounded-lg shadow-lg p-6 mt-4 transition-transform duration-300 hover:scale-105 ${darkMode ? 'hover:shadow-black/50' : 'hover:shadow-black/50'}`}>
            <h3 className="text-xl font-semibold text-black dark:text-white">Harrisburg Area Community College</h3>
            <p className="text-black dark:text-white">Associate's degree</p>
            <p className="text-black dark:text-white">Completed first year</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-8 z-10">
        <Switch
          checked={darkMode}
          onChange={toggleDarkMode}
          className={`relative inline-flex items-center h-8 rounded-full w-16 transition-colors duration-200 ease-in-out ${darkMode ? 'bg-black' : 'bg-black'}`}
        >
          <span className={`block w-6 h-6 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${darkMode ? 'translate-x-9' : 'translate-x-1'}`}>
            {darkMode ? '🌙' : '☀️'}
          </span>
        </Switch>
      </div>

      <div className="star-field fixed inset-0 pointer-events-none" />
    </div>
  );
}