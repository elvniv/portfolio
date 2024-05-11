import React from 'react'
import { Link } from 'react-router-dom';

// this is the black floating button that helps add
export default function AddGoal() {
  return (
    <Link
    to="/create-goal"
    className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center hover:bg-green-500 transition-colors duration-200"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  </Link>
  )
}