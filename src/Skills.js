import React from 'react';
import NavigationBar from './NavigationBar';
import { motion } from 'framer-motion';

const SkillBar = ({ skill, level, darkMode }) => (
  <motion.div 
    className="mb-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between mb-1">
      <span className="font-medium">{skill}</span>
      <span>{level}%</span>
    </div>
    <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${level}%` }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`h-2 rounded-full ${darkMode ? 'bg-black' : 'bg-black'}`}
      ></motion.div>
    </div>
  </motion.div>
);

const SkillCategory = ({ category, skills, darkMode }) => (
  <motion.div 
    className={`p-8 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <h2 className="text-3xl font-semibold mb-6 text-center">{category}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {skills.map((skill, skillIndex) => (
        <SkillBar key={skillIndex} skill={skill.name} level={skill.level} darkMode={darkMode} />
      ))}
    </div>
  </motion.div>
);

const Skills = ({ darkMode }) => {
  const skillCategories = [
    {
      category: "Design",
      skills: [
        { name: "UX Design", level: 90 },
        { name: "UI Design", level: 85 },
        { name: "Adobe Creative Suite", level: 80 },
        { name: "Figma", level: 95 },
        { name: "Sketch", level: 75 },
      ]
    },
    {
      category: "Development",
      skills: [
        { name: "HTML/CSS", level: 95 },
        { name: "JavaScript", level: 90 },
        { name: "React", level: 85 },
        { name: "Node.js", level: 75 },
        { name: "FastAPI", level: 70 },
      ]
    },
    {
      category: "Other",
      skills: [
        { name: "Project Management", level: 85 },
        { name: "Team Leadership", level: 80 },
        { name: "Client Communication", level: 90 },
        { name: "Photography", level: 75 },
      ]
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <NavigationBar darkMode={darkMode} />
      <motion.div 
        className="container mx-auto px-4 py-12 max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-8 text-center"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Skills & Expertise
        </motion.h1>
        <motion.p 
          className="text-xl mb-12 text-center leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Throughout my career, I've honed a diverse set of skills that enable me to tackle various challenges in the tech and design world. Here's an overview of my key competencies:
        </motion.p>
        <div className="space-y-16">
          {skillCategories.map((category, index) => (
            <SkillCategory key={index} {...category} darkMode={darkMode} />
          ))}
        </div>
        <motion.div 
          className={`mt-16 p-8 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} transition-all duration-300 ease-in-out hover:shadow-2xl`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">Continuous Learning</h2>
          <p className="text-center text-xl leading-relaxed">
            I'm always eager to expand my skill set. Currently, I'm focusing on deepening my knowledge in:
          </p>
          <motion.ul 
            className="mt-4 text-center text-lg space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <li>Data Visualization</li>
            <li>Cloud Computing</li>
          </motion.ul>
          <p className="mt-4 text-center text-xl leading-relaxed">
            These emerging technologies will enhance my ability to create data-driven designs and scalable applications.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Skills;