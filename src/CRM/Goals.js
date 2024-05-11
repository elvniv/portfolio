import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { ColorPicker } from './CreateGoal';
import { db } from '../Firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Goals() {
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [goals, setGoals] = useState([]);
    const [completedGoals, setCompletedGoals] = useState([]);
    const [showCompletedGoals, setShowCompletedGoals] = useState(false);
    const [filteredGoals, setFilteredGoals] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });
    }, [auth]);

    const snapshotToGoals = (setter) => (querySnapshot) => {
      const goalsData = [];
      querySnapshot.forEach((doc) => {
        goalsData.push({ id: doc.id, ...doc.data() });
      });
      setter(goalsData);
    };
  
    const filterGoalsByColor = (color) => {
      if (color) {
        setFilteredGoals(goals.filter((goal) => goal.color === color));
      } else {
        setFilteredGoals(goals);
      }
    };
  
    const fetchGoals = () => {
      if (!currentUser) {
        // Handle case where there is no authenticated user
        return;
      }
    
      const q = currentUser.uid ? query(collection(db, 'goals'), where('userId', '==', currentUser.uid)) : null;
    
      if(q) {
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const activeGoalsData = [];
          const completedGoalsData = [];
    
          querySnapshot.forEach((doc) => {
            const goalData = { id: doc.id, ...doc.data() };
    
            if (goalData.completed) {
              completedGoalsData.push(goalData);
            } else {
              activeGoalsData.push(goalData);
            }
          });
    
          setGoals(activeGoalsData);
          setFilteredGoals(activeGoalsData);
          setCompletedGoals(completedGoalsData);
        }, (error) => {
          console.error("Error fetching goals: ", error);
        });
    
        return () => unsubscribe();
      }
    };
  
    useEffect(() => {
        fetchGoals();
        // Ensure cleanup on component unmount
        return () => {
            fetchGoals();
        };
    }, [currentUser]); // Add currentUser as a dependency

    const markGoalAsCompleted = async (goalId) => {
      await updateDoc(doc(db, 'goals', goalId), {
        completed: true,
        completedAt: new Date()
      });
    };
  
    const toggleCompletedGoals = () => {
      setShowCompletedGoals(!showCompletedGoals);
    };
  
    const resetFilter = () => {
      setFilteredGoals(goals);
    };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Active Tasks</h3>
                <div className="mb-4 flex items-bottom opacity-20 hover:opacity-100 transition-opacity duration-200">
                  <div>
                    <label className="block text-gray-700 mb-2">Filter by Color</label>
                    <ColorPicker onSelect={filterGoalsByColor} />
                  </div>
                  <button
                    onClick={resetFilter}
                    className="ml-4 w-6 h-6 bg-gray-200 text-white flex items-center justify-center rounded-full hover:bg-gray-950"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ul className="space-y-2">
                {filteredGoals.length > 0 ? filteredGoals.map((goal) => (
                    <li
                    key={goal.id}
                    onClick={() => navigate(`/goal/${goal.id}`)}
                    className="p-3 bg-gray-100 rounded flex justify-between items-center hover:bg-gray-200"
                    >
                    <div
                        className="w-2 h-full"
                        style={{ backgroundColor: goal.color }}
                    ></div>
                    <Link
                        to={`/goal/${goal.id}`}
                        className="text-black font-semibold flex-grow overflow-hidden"
                        style={{ maxWidth: "calc(100% - 64px)" }} // Adjust the value based on your needs
                    >
                        <div style={{ overflow: "auto", whiteSpace: "nowrap" }}>
                        {goal.title}
                        </div>
                    </Link>
                    <button
                        onClick={() => markGoalAsCompleted(goal.id)}
                        className="bg-gray-300 text-white w-8 h-8 rounded-md flex items-center justify-center hover:bg-green-500"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        >
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                    </button>
                    </li>
                )) : <p>No Current Active Tasks</p>}
                </ul>

              </div>
            </div>
            <div className="col-span-1 md:col-span-2 mb-4">
              <button
                onClick={toggleCompletedGoals}
                className="text-black px-4 py-2 rounded"
              >
                {showCompletedGoals ? "Hide" : "View Completed Tasks"}
              </button>
            </div>
            {showCompletedGoals && (
              <div className="col-span-1 md:col-span-2">
                <div className="bg-white p-6 rounded-xl border">
                  <h3 className="text-lg font-semibold mb-4">Completed Tasks</h3>
                  <ul className="space-y-2">
                    {completedGoals.map((goal) => (
                      <li
                        key={goal.id}
                        className="p-3 bg-gray-50 rounded"
                        onClick={() => navigate(`/goal/${goal.id}`)}
                      >
                        <div
                          className="w-4 h-full mr-4"
                          style={{ backgroundColor: goal.color }}
                        ></div>
                        <Link
                          to={`/goal/${goal.id}`}
                          className="text-black font-semibold hover:underline"
                        >
                          {goal.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            </div>
  )
}