import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { FiTrash2, FiCheck, FiLoader } from 'react-icons/fi';
import LoadingPage from '../Dashboard/Agreement/loadingPage';
import mixpanel from 'mixpanel-browser';

const GoalDetail = () => {
  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoal = async () => {
      const goalRef = doc(db, 'goals', goalId);
      const goalSnapshot = await getDoc(goalRef);

      if (goalSnapshot.exists()) {
        setGoal({ id: goalSnapshot.id, ...goalSnapshot.data() });
        mixpanel.track("Goal Detail Viewed", { 'Goal ID': goalSnapshot.id, 'Goal Title': goalSnapshot.data().title });
      }
    };

    fetchGoal();
  }, [goalId]);

  useEffect(() => {
    const fetchTodos = () => {
      const q = query(collection(db, 'todos'), where('goalId', '==', goalId));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todosData = [];
        querySnapshot.forEach((doc) => {
          todosData.push({ id: doc.id, ...doc.data() });
        });
        setTodos(todosData);
      });

      return () => unsubscribe();
    };

    if (goalId) {
      fetchTodos();
    }
  }, [goalId]);

  const addTodo = async () => {
    if (newTodo.trim() && !isSaving) {
      setIsSaving(true);
      const newDoc = await addDoc(collection(db, 'todos'), {
        goalId,
        userId: goal.userId,
        title: newTodo,
        completed: false,
      });
      mixpanel.track("Todo Added", { 'Todo ID': newDoc.id, 'Todo Title': newTodo });
      setNewTodo('');
      setIsSaving(false);
    }
  };

  const toggleTodoCompletion = async (todoId, completed) => {
    await updateDoc(doc(db, 'todos', todoId), { completed: !completed });
    mixpanel.track("Todo Completion Toggled", { 'Todo ID': todoId, 'Completion Status': !completed });
  };

  const editTodo = async (todoId, newTitle) => {
    if (newTitle.trim()) {
      await updateDoc(doc(db, 'todos', todoId), { title: newTitle });
      mixpanel.track("Todo Edited", { 'Todo ID': todoId, 'New Title': newTitle });
    }
  };

  const deleteTodo = async (todoId) => {
    await deleteDoc(doc(db, 'todos', todoId));
    mixpanel.track("Todo Deleted", { 'Todo ID': todoId });
  };

  const calculateDaysRemaining = (deadline) => {
    const currentDate = new Date();
    const timeDifference = deadline - currentDate;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  if (!goal) {
    return <LoadingPage />;
  }

  const daysRemaining = calculateDaysRemaining(goal.deadline.toDate());

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">{goal.title}</h1>
        <p className="text-center text-sm text-gray-600">{goal.description}</p>
        <p className="text-center text-sm font-bold text-gray-600">Days remaining: {daysRemaining}</p>
        <div className='flex justify-center mt-4'>
            <button
                    onClick={() => navigate('/crm-dashboard')}
                    className="mt-4 bg-gray-200 text-gray-800 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                    Back to Dashboard
            </button>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-center text-xl font-bold tracking-tight text-gray-900">To-Do List</h2>
          <ul className="mt-2 space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoCompletion(todo.id, todo.completed)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                />
                <input
                  type="text"
                  defaultValue={todo.title}
                  onBlur={(e) => editTodo(todo.id, e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
                <button onClick={() => deleteTodo(todo.id)} className="text-red-500 focus:outline-none">
                  <FiTrash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="New to-do item"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
            />
            <button
              onClick={addTodo}
              disabled={isSaving}
              className={`flex w-full justify-center rounded-md px-3 py-2 mt-2 text-sm font-semibold text-white shadow-sm ${
                isSaving ? 'bg-gray-400' : 'bg-black hover:bg-green-500'
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600`}
            >
              {isSaving ? (
                <div className="flex items-center justify-center">
                  <FiLoader className="animate-spin mr-2" />
                  Saving...
                </div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetail;