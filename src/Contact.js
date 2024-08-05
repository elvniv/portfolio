import React from 'react';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';
import NavigationBar from './NavigationBar';

const Contact = ({ darkMode }) => {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <NavigationBar darkMode={darkMode} />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">Contact Me</h1>
        <p className="text-xl mb-8 text-center">
          I'm always open to new opportunities, collaborations, or just a friendly chat about technology and design. 
          Feel free to reach out to me through any of the provided contact methods.
        </p>
        
        <div className="flex justify-center">
          <div className="p-6 rounded-lg shadow-lg border border-gray-300 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center">Contact Information</h2>
            <p className="mb-2 flex items-center justify-center">
              <FaEnvelope className="mr-2" />
              <span>Email: elvinatwine1@gmail.com</span>
            </p>
            <p className="mb-2 flex items-center justify-center">
              <FaEnvelope className="mr-2" />
              <span>Email: elvin@klorah.com</span>
            </p>
            <p className="mb-4 text-center">Location: Connecticut, USA</p>
            
            <h2 className="text-2xl font-semibold mb-4 text-center">Connect with Me</h2>
            <div className="flex justify-center space-x-4">
              <a href="https://www.linkedin.com/in/elivnatwiine" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-500">
                <FaLinkedin />
              </a>
              <a href="https://github.com/elvniv" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-500">
                <FaGithub />
              </a>
              <a href="https://twitter.com/elvniv" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-500">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;