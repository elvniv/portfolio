import React from 'react';
import { Switch } from '@headlessui/react';

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="fixed bottom-8 left-8 z-10">
      <Switch
        checked={darkMode}
        onChange={toggleDarkMode}
        className={`relative inline-flex items-center h-8 rounded-full w-16 transition-colors duration-200 ease-in-out ${
          darkMode ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`block w-6 h-6 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${
            darkMode ? 'translate-x-9' : 'translate-x-1'
          }`}
        >
          {darkMode ? '🌙' : '☀️'}
        </span>
      </Switch>
    </div>
  );
};

export default DarkModeToggle;