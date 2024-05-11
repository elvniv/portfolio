import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './Firebase'; // Make sure this path is correct

const FeedbackButtonWithForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const contactEmail = "support@klorah.zendesk.com"; // Your support email
  const contactPhone = "+18566996475"; // Your support phone number

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (feedback.trim() === '') {
      return; // Optionally show an error message or shake the input
    }
    
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'feedback'), {
        text: feedback,
        timestamp: new Date(),
      });

      setFeedback('');
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitSuccess(false);
      }, 3000); // Close the form after 3 seconds
    } catch (error) {
      console.error("Error writing document: ", error);
      // Optionally show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end z-50">
      {isOpen && (
        <div className="mb-3 p-4 bg-white rounded-lg shadow-lg w-64">
          {submitSuccess ? (
            <div className="text-center">
              <p>Thank you for your feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Feedback</h3>
                <button type="button" onClick={() => setIsOpen(false)} className="text-black text-lg">
                  &times;
                </button>
              </div>
              <textarea
                className="w-full p-2 mb-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                rows="3"
                placeholder="Enter your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-2 w-full ${isSubmitting ? 'bg-gray-500' : 'bg-black'} text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )}
          <div className="flex flex-col items-start mt-4">
            <p>Contact directly:</p>
            <a href={`mailto:${contactEmail}`} className="text-blue-500 hover:text-blue-600">
              {contactEmail}
            </a>
            <a href={`tel:${contactPhone}`} className="text-blue-500 hover:text-blue-600">
              {contactPhone}
            </a>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white p-3 rounded-full shadow-lg text-2xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        aria-label="Feedback"
      >
        ?
      </button>
    </div>
  );
};

export default FeedbackButtonWithForm;
