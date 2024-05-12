import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

const SearchPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    setSearchQuery(suggestion.label);
  };

  const handleFindCandidate = () => {
    alert(`Searching for: ${searchQuery}`);
    // Implement search functionality or redirect as necessary
  };

  return (
    <div className={`h-screen flex flex-col items-center justify-center bg-${darkMode ? 'black' : 'white'} text-${darkMode ? 'white' : 'black'}`}>
      <h1 className="text-2xl md:text-4xl mb-4 md:mb-6 font-bold text-center">Find the perfect candidate for your project with AI</h1>
      <p className="text-base md:text-lg mb-6 md:mb-10 text-center">Discover and hire the best candidates available across the web for your project.</p>
      <div className="flex items-center justify-between w-3/5 max-w-md p-4">
        <input 
          type="text"
          placeholder="What are ya lookin for?... "
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={`w-full p-3 border-2 border-gray-300 focus:border-blue-500 placeholder-gray-500 text-lg rounded-lg ${darkMode ? 'text-white' : 'text-black'} bg-${darkMode ? 'black' : 'white'}`}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 my-2">
        {suggestions.map((item, index) => (
          <div key={index} className={`p-2 text-lg bg-gray-200 rounded-lg shadow ${darkMode ? 'text-black' : ''}`} onClick={() => handleSuggestionClick(item.label)}>
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
  );
};

export default SearchPage;
