import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import FreelancerCard from './FreelancerCard';
import NavigationBar from './NavigationBar';
import SignInModal from './SignInModal';

const SearchPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [currentSubheadingIndex, setCurrentSubheadingIndex] = useState(0);
  const [typedHeading, setTypedHeading] = useState('');
  const [typedSubheading, setTypedSubheading] = useState('');

  const headings = ["Find the perfect candidate for your project with AI", "Discover top talents around the globe", "Hire skilled professionals easily"];
  const subheadings = ["Discover and hire the best candidates available across the web for your project.", "Streamline your recruitment process with our AI-driven platform.", "Connect with top professionals from various fields."];

  useEffect(() => {
    
    const changeTextInterval = setInterval(() => {
      setCurrentHeadingIndex((current) => (current + 1) % headings.length);
      setCurrentSubheadingIndex((current) => (current + 1) % subheadings.length);
    }, 10000); // Change text every 10 seconds

    return () => clearInterval(changeTextInterval);
  }, []);

  useEffect(() => {
    let typingTimer;
    const typeText = (text, setter, index = 0) => {
      setter(text.slice(0, index));
      if (index < text.length) {
        typingTimer = setTimeout(() => {
          typeText(text, setter, index + 1);
        }, 50); // Adjust typing speed by changing the delay
      }
    };

    typeText(headings[currentHeadingIndex], setTypedHeading);
    typeText(subheadings[currentSubheadingIndex], setTypedSubheading);

    return () => clearTimeout(typingTimer);
  }, [currentHeadingIndex, currentSubheadingIndex]);


  const suggestions = [
    { label: 'A designer for my website - Need a creative designer to revamp my website', emoji: '🎨' },
    { label: 'A developer for my app - Looking for a skilled developer to build my mobile app', emoji: '💻' },
    { label: 'A marketing expert - Seeking a marketing guru to promote my business', emoji: '📈' },
    { label: 'A content writer - In need of a talented writer to create engaging content', emoji: '✍️' }
  ];

  const handleSuggestionClick = suggestion => {
    setSearchQuery(suggestion.label);
    setShowResults(true);
  };

  const handleFindCandidate = () => {
    alert(`Searching for: ${searchQuery}`);
    setShowResults(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const stars = 50; // Reduced number of stars to 50
    const starField = document.querySelector('.star-field');
    const existingStars = document.querySelectorAll('.star');
    existingStars.forEach(star => star.remove()); // Remove existing stars before adding new ones

    for (let i = 0; i < stars; i++) {
      let star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.floor(Math.random() * 100)}vw`;
      star.style.top = `${Math.floor(Math.random() * 100)}vh`;
      star.style.animationDuration = `${Math.random() * 6 + 4}s`; // Slower animation speeds
      star.style.backgroundColor = darkMode ? 'white' : 'black'; // Star color changes based on dark mode
      starField.appendChild(star);
    }
  }, [darkMode]);

  return (
    <>
      <NavigationBar darkMode={darkMode} />
      <div className={`h-screen flex flex-col items-center justify-center bg-${darkMode ? 'black' : 'white'} text-${darkMode ? 'white' : 'black'} relative star-field`} style={{ position: 'relative', overflow: 'hidden' }}>
        <h1 className="text-2xl md:text-4xl mb-4 md:mb-6 font-bold text-center">
          {typedHeading}
        </h1>
        <p className="text-base md:text-lg mb-6 md:mb-10 text-center">
          {typedSubheading}
        </p>
        <div className="flex items-center justify-center p-4 w-full">
          <input 
              type="text"
              placeholder="Describe your project and the candidates you are looking for in detail..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full p-3 border-2 border-gray-300 focus:border-black placeholder-gray-500 text-xl rounded-lg ${darkMode ? 'text-white' : 'text-black'} bg-${darkMode ? 'black' : 'white'}`}
              style={{ maxWidth: '800px' }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 my-2">
          {suggestions.map((item, index) => (
            <div key={index} className={`p-2 text-lg bg-gray-200 rounded-lg shadow cursor-pointer ${darkMode ? 'text-black' : ''}`} onClick={() => handleSuggestionClick(item)}>
              {item.emoji} {item.label}
            </div>
          ))}
        </div>
        <button className={`mt-2 p-3 rounded-lg hover:bg-green-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-black text-white'}`} onClick={handleFindCandidate}>Find Candidate 🚀</button>
        {showResults && <SignInModal />}
        <div className="fixed bottom-8 left-8 star-field">
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            className={`relative inline-flex items-center h-8 rounded-full w-16 bg-gray-300 p-1 transition-colors duration-200 ease-in-out ${darkMode ? 'bg-blue-500' : 'bg-gray-400'}`}
            aria-label="Dark mode switch"
          >
            <span className={`block w-6 h-6 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${darkMode ? 'translate-x-8' : 'translate-x-0'}`} aria-hidden="true">
              {darkMode ? '🌚' : '🌞'}
            </span>
          </Switch>
        </div>
        <a href="https://klorah.com" target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-8 text-sm rounded-lg p-2 hover:bg-gray-200">Powered by Klorah</a>
      </div>
    </>
  );
};

export default SearchPage;

