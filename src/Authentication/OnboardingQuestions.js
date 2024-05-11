import React, { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline'; 
import { useNavigate } from 'react-router-dom';


const questions = [
    {
      text: "How often do you generate invoices for your clients?",
      options: ["Regularly", "Occasionally", "Rarely"]
    },
    {
      text: "What's the typical number of invoices you create in a month?",
      options: ["1-5", "6-10", "11-20", "More than 20"]
    },
    {
      text: "Are you interested in exploring AI-powered solutions for client agreements?",
      options: ["Definitely interested", "Somewhat interested", "Not sure yet", "Not interested"]
    },
    {
      text: "How crucial is automating the invoicing process for you?",
      options: ["Very crucial", "Moderately important", "Slightly important", "Not important"]
    },
    {
      text: "Do you currently use any tools or software for invoicing and agreements?",
      options: ["Yes, I use several tools", "Yes, but only one", "No, I don't use any"]
    },
    {
      text: "Would you like to learn how our AI agreements can streamline your workflow?",
      options: ["Yes, please!", "Maybe later", "Not right now"]
    },
    {
      text: "Finally, what feature in an invoicing tool is most important to you?",
      options: ["Ease of use", "Customization options", "Integration with other tools", "Cost-effectiveness"]
    }
  ];
  

export default function OnboardingQuestions({ onAnswer }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = questions[currentQuestionIndex];
    const navigate = useNavigate();

    const handleOptionSelect = (option) => {
        // Move to the next question or finish the onboarding
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            navigate('/dashboard'); // Navigate to Membership Billing page when pro is ready
        }
    };

    return (
        <div className="container mx-auto p-4 flex items-center justify-center h-screen">
            <div className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-black mb-4 text-center">{currentQuestion.text}</h2>
                <div className="grid gap-2">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className="flex items-center gap-2 p-3 border border-gray-300 rounded-md shadow-sm hover:border-black hover:shadow-md transition duration-300"
                            onClick={() => handleOptionSelect(option)}
                        >
                            <CheckCircleIcon className="h-6 w-6 text-black" />
                            <span className="text-sm text-black">{option}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
