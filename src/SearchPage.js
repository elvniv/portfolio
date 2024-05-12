import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

const SearchPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
  }, [darkMode]); // Effect runs when darkMode changes

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const suggestions = [
    { label: 'A designer for my website', emoji: '🎨' },
    { label: 'A developer for my app', emoji: '💻' },
    { label: 'A marketing expert', emoji: '📈' },
    { label: 'A content writer', emoji: '✍️' }
  ];

  const handleSuggestionClick = suggestion => {
    setSearchQuery(suggestion.label); // Update search query with the suggestion label
  };

  const handleFindCandidate = () => {
    alert(`Searching for: ${searchQuery}`);
    // Implement search functionality or redirect as necessary
  };

  return (
    <>
      <style>
        {`
          .star-field {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          .star {
            position: absolute;
            width: 3px;
            height: 3px;
            background: white;
            box-shadow: 0 0 6px white;
            border-radius: 50%;
            animation-name: float;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
          }

          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            100% {
              transform: translateY(-100vh);
            }
          }
        `}
      </style>
      <div className={`h-screen flex flex-col items-center justify-center bg-${darkMode ? 'black' : 'white'} text-${darkMode ? 'white' : 'black'} relative star-field`}>
        <h1 className="text-2xl md:text-4xl mb-4 md:mb-6 font-bold text-center">Find the perfect candidate for your project with AI</h1>
        <p className="text-base md:text-lg mb-6 md:mb-10 text-center">Discover and hire the best candidates available across the web for your project.</p>
        <div className="flex items-center justify-between w-3/5 max-w-md p-4">
          <input 
            type="text"
            placeholder="What are ya lookin for?... "
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full p-3 border-2 border-gray-300 focus:border-black placeholder-gray-500 text-lg rounded-lg ${darkMode ? 'text-white' : 'text-black'} bg-${darkMode ? 'black' : 'white'}`}
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
        <div className="fixed bottom-8 left-8">
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
