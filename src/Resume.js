import React from 'react';
import NavigationBar from './NavigationBar';

const Resume = ({ darkMode }) => {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <NavigationBar darkMode={darkMode} />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">Professional Resume</h1>
        
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 border-b pb-2">Professional Experience</h2>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold">Founder & CEO - Klorah</h3>
            <p className="italic text-lg mb-2">September 2023 - Present</p>
            <p className="text-base mb-4">
              Leading a startup focused on improving the freelance industry by adding traditional job benefits for independent contractors. At Klorah, I have been key in:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Crafting and executing the company's strategic vision to disrupt the market</li>
              <li>Leading the development and coding of core products, ensuring top-notch user experience design</li>
              <li>Assembling and nurturing a high-performing, diverse team of professionals</li>
              <li>Securing substantial funding and maintaining robust investor relationships</li>
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold">Student Involvement - Harrisburg Area Community College</h3>
            <p className="italic text-lg mb-2">October 2023 - July 2024</p>
            <p className="text-base mb-4">
              Actively participated in student life and leadership roles, contributing to the campus community:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Organized and led campus events, enhancing student engagement and fostering a sense of community</li>
              <li>Collaborated with faculty and staff to improve student services and campus initiatives</li>
              <li>Developed leadership and communication skills through various workshops and training sessions</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-semibold">UX & Product Designer - Kaiya</h3>
            <p className="italic text-lg mb-2">November 2021 - April 2022</p>
            <p className="text-base mb-4">
              Worked on user-centric solutions for a community of teens focused on mental health and wellness. Achievements include:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Conducted user research to inform design decisions</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-semibold">Social Media Designer - Day One</h3>
            <p className="italic text-lg mb-2">August 2021 - November 2021</p>
            <p className="text-base mb-4">
              Created engaging social media content for our company, enhancing our brand presence and audience engagement. Key accomplishments:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Developed visual content strategies for our brand</li>
            </ul>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 border-b pb-2">Education</h2>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold">University of Connecticut</h3>
            <p className="italic text-lg mb-2">Bachelor's degree in Business Management (Expected graduation: May 2027)</p>
            <p className="text-base mb-4">
              Currently pursuing a degree with a focus on entrepreneurship and digital business strategies. Relevant coursework includes:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Entrepreneurship and Innovation</li>
              <li>Digital Marketing and E-commerce</li>
              <li>Business Analytics</li>
              <li>Organizational Behavior and Leadership</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-2xl font-semibold">Harrisburg Area Community College</h3>
            <p className="italic text-lg mb-2">Associate's degree (Completed first year)</p>
            <p className="text-base mb-4">
              Completed foundational courses in business and general education, laying the groundwork for advanced studies in management and entrepreneurship.
            </p>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 border-b pb-2">Skills & Expertise</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Technical Skills</h3>
              <ul className="list-disc pl-5">
                <li>Web Development (HTML, CSS, JavaScript)</li>
                <li>React.js and React Native</li>
                <li>User Experience (UX) Design</li>
                <li>Adobe Creative Suite</li>
                <li>Digital Marketing Tools</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Soft Skills</h3>
              <ul className="list-disc pl-5">
                <li>Project Management</li>
                <li>Team Leadership</li>
                <li>Problem-solving</li>
                <li>Effective Communication</li>
                <li>Entrepreneurial Mindset</li>
              </ul>
            </div>
          </div>
        </section>
        
        <div className="text-center">
          <a 
            href="/elvin-atwine-resume.pdf" 
            download="Elvin_Atwine_Resume.pdf"
            className={`inline-block px-6 py-3 rounded-full ${darkMode ? 'bg-white text-black' : 'bg-black text-white'} hover:opacity-80 transition-opacity duration-300`}
          >
            Download Resume (PDF)
          </a>
        </div>
      </div>
    </div>
  );
};

export default Resume;