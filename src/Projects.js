import React from 'react';
import NavigationBar from './NavigationBar';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

const ProjectCard = ({ project, index, darkMode }) => (
  <motion.div 
    className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} hover:shadow-xl transition-all duration-300`}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.03 }}
  >
    <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
      {project.description}
    </p>
    <div className="flex space-x-4">
      <a 
        href={project.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`flex items-center px-4 py-2 rounded ${darkMode ? 'text-white' : 'text-black'} hover:opacity-80 transition-opacity duration-300`}
      >
        View Project <FaExternalLinkAlt className="ml-2" />
      </a>
    </div>
  </motion.div>
);

const Projects = ({ darkMode }) => {
  const projects = [
    {
        title: "Klorah",
        description: "A comprehensive platform providing traditional job benefits to freelancers, bridging the gap between conventional employment and gig economy.",
        link: "https://klorah.com"
      },
    {
      title: "UseGOL",
      description: "A habit tracking app that helps users build and maintain positive habits through daily tracking and progress visualization.",
      link: "https://usegol.com"
    },
    {
      title: "Iveyy Clothing",
      description: "An e-commerce clothing brand focusing on unique, trendy designs. Managed everything from product design to marketing strategies.",
      link: "https://www.instagram.com/iveyyclothing/?hl=en"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <NavigationBar darkMode={darkMode} />
      <motion.div 
        className="container mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-8 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Featured Projects
        </motion.h1>
        <motion.p 
          className="text-xl mb-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Exploring the intersection of technology and user experience through innovative solutions.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} darkMode={darkMode} />
          ))}
        </div>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Explore More</h2>
          <p className="mb-8 text-xl">Discover additional projects and contributions on my GitHub.</p>
          <a 
            href="https://github.com/elvniv" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`inline-flex items-center px-6 py-3 rounded-full ${darkMode ? 'text-white' : 'text-black'} hover:opacity-80 transition-opacity duration-300 text-lg font-semibold`}
          >
            <FaGithub className="mr-2" /> View GitHub Profile
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Projects;