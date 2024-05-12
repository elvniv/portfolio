import React from 'react';

const FreelancerCard = ({ darkMode }) => {
  const freelancer = {
    name: "Jane Doe",
    profession: "Graphic Designer",
    rating: 4
  };

  return (
    <div className={`freelancer-card bg-${darkMode ? 'gray-800' : 'white'} p-4 rounded-lg shadow-lg my-4`} style={{ backgroundColor: darkMode ? 'black' : 'white', color: darkMode ? 'white' : 'black'}}>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: darkMode ? 'white' : 'black' }}>{freelancer.name}</h2>
        <p className="text-gray-600" style={{ color: darkMode ? 'white' : 'black' }}>{freelancer.profession}</p>
      </div>
      <div className="flex items-center mt-2">
        {Array(freelancer.rating).fill().map((_, index) => (
          <span key={index} className={`text-${darkMode ? 'white' : 'black'} text-2xl`}>⭐</span>
        ))}
      </div>
      <div className="flex items-center justify-center mt-4">
        <button className={`py-2 px-6 bg-${darkMode ? 'white' : 'black'} text-${darkMode ? 'black' : 'white'} rounded hover:bg-${darkMode ? 'black' : 'white'} flex items-center justify-center`} style={{ backgroundColor: darkMode ? 'white' : 'black', color: darkMode ? 'black' : 'white' }}>
          <span className="ml-2">Contact</span>
        </button>
      </div>
    </div>
  );
};

export default FreelancerCard;
