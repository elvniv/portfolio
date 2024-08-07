import React from 'react';
import NavigationBar from './NavigationBar';

const Education = ({ darkMode }) => {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <NavigationBar darkMode={darkMode} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-8">Education</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">University of Connecticut</h2>
          <p className="text-xl mb-2">Bachelor's degree in Business Management</p>
          <p className="italic mb-4">Expected graduation: May 2027</p>
          <p>
            Currently pursuing a degree in Business Management with a focus on entrepreneurship and digital business strategies. 
            Engaging in various business case competitions and leadership workshops to apply classroom knowledge to real-world scenarios.
          </p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Harrisburg Area Community College</h2>
          <p className="text-xl mb-2">Associate's degree in General Studies</p>
          <p className="italic mb-4">Completed first year</p>
          <p>
            Completed foundational courses in business, economics, and general education. 
            Participated in the college's entrepreneurship club, laying the groundwork for future business ventures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Education;