import React, { useState, useEffect, useRef } from 'react';
import { Switch } from '@headlessui/react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView, 
  useMotionValue, 
  useVelocity, 
  useAnimationFrame 
} from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaArrowDown } from 'react-icons/fa';
import styled from 'styled-components';
import NavigationBar from './NavigationBar'; // Make sure this path is correct

// Styled components for parallax effect (unchanged)
const ParallaxContainer = styled.div`
  overflow: hidden;
  letter-spacing: -2px;
  line-height: 0.8;
  margin: 0;
  white-space: nowrap;
  display: flex;
  flex-wrap: nowrap;
`;

const ParallaxScroller = styled(motion.div)`
  font-weight: 600;
  text-transform: uppercase;
  font-size: 64px;
  display: flex;
  white-space: nowrap;
  flex-wrap: nowrap;

  span {
    display: block;
    margin-right: 30px;
  }
`;

// Utility function for wrapping (unchanged)
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const ParallaxSection = ({ children, baseVelocity = 50 }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <ParallaxContainer>
      <ParallaxScroller style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </ParallaxScroller>
    </ParallaxContainer>
  );
};

const StickySection = ({ title, content }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className="sticky top-0 h-screen flex items-center justify-center bg-opacity-90 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">{title}</h2>
        <p className="text-xl md:text-2xl leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
};

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false);
  const [typedHeading, setTypedHeading] = useState('');
  const [typedSubheading, setTypedSubheading] = useState('');
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heading = "Elvin Atwine";
  const subheading = "Innovator, Designer, Entrepreneur";

  const sections = [
    {
      title: "The Beginning",
      content: "My journey began at 16, when I founded Iveyy Clothing. With no prior experience in retail, I dove headfirst into the world of e-commerce and fashion. This venture taught me the value of creativity, perseverance, and the power of a strong brand identity."
    },
    {
      title: "Exploring Design",
      content: "As I grew, so did my passion for design. I transitioned into UX and Product Design at Kaiya, where I honed my skills in creating user-centric digital experiences. This role opened my eyes to the impact thoughtful design can have on people's lives."
    },
    {
      title: "The Present",
      content: "Today, I'm the Founder and CEO of Klorah, a platform that's reimagining the future of work for freelancers. We're bridging the gap between traditional employment and the gig economy, bringing stability and benefits to the world of independent work."
    },
    {
      title: "The Future",
      content: "As I pursue my degree in Business Management at the University of Connecticut, I'm constantly seeking new ways to innovate and create value. My goal is to continue building solutions that make a positive impact on people's lives and transform industries."
    }
  ];

  useEffect(() => {
    const typeText = (text, setter, delay = 100) => {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setter(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, delay);
    };

    typeText(heading, setTypedHeading);
    setTimeout(() => typeText(subheading, setTypedSubheading, 50), heading.length * 100);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className={`${darkMode ? 'bg-black text-white' : 'bg-white text-black'} transition-colors duration-300 ease-in-out`}>
      <NavigationBar darkMode={darkMode} />
      <div className="min-h-screen pt-16" ref={containerRef}>
        <motion.header 
          className="h-screen flex flex-col items-center justify-center text-center px-4"
          style={{ scale, opacity, y }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            {typedHeading}
          </h1>
          <p className={`text-xl md:text-3xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {typedSubheading}
          </p>
          <motion.div 
            className="mt-16"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <FaArrowDown size={30} />
          </motion.div>
        </motion.header>

        <ParallaxSection>Innovate • Design • Create • Lead</ParallaxSection>

        {sections.map((section, index) => (
          <StickySection key={index} title={section.title} content={section.content} />
        ))}

        <ParallaxSection baseVelocity={-50}>Entrepreneur • Visionary • Problem Solver</ParallaxSection>

        <motion.div 
          className="h-screen flex flex-col items-center justify-center text-center px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Let's Connect</h2>
          <div className="flex space-x-8">
            <motion.a 
              href="https://linkedin.com/in/yourusername" 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLinkedin size={40} />
            </motion.a>
            <motion.a 
              href="https://github.com/elvniv" 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub size={40} />
            </motion.a>
            <motion.a 
              href="mailto:your.email@example.com" 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEnvelope size={40} />
            </motion.a>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-8 left-8 z-10">
        <Switch
          checked={darkMode}
          onChange={toggleDarkMode}
          className={`relative inline-flex items-center h-8 rounded-full w-16 transition-colors duration-200 ease-in-out ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <span className={`block w-6 h-6 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${darkMode ? 'translate-x-9' : 'translate-x-1'}`}>
            {darkMode ? '🌙' : '☀️'}
          </span>
        </Switch>
      </div>
    </div>
  );
}