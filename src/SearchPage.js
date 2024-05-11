import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

const SearchPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`h-screen flex flex-col items-center justify-center bg-${darkMode ? 'black' : 'white'} text-${darkMode ? 'white' : 'black'}`}>
      <h1 className="text-4xl mb-6 font-bold">Find the perfect candidate for your project with AI</h1>
      <p className="text-lg mb-10 ">Discover and hire the best candidates available across the web for your project.</p>
      <div className="relative w-4/5 max-w-lg">
        <input 
          type="text"
          placeholder="What are ya lookin for?... "
          className={`w-full p-4 border-2 border-gray-300 focus:border-blue-500 placeholder-gray-500 text-lg rounded-lg ${darkMode ? 'text-white' : 'text-black'} bg-${darkMode ? 'black' : 'white'}`}
          style={{ marginTop: '20px' }}
        />
        <span role="img" aria-label="sparkles" style={{ marginLeft: '-30px' }}>✨</span>
      </div>
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
      <a href="https://klorah.com" target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-8 text-sm rounded-full p-4 hover:bg-gray-200">Powered by Klorah</a>
    </div>
  );
};
export default SearchPage;
