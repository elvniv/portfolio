import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../NavigationBar';
import Goals from './Goals';
import AddGoal from './AddGoal';

export default function CrmDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen">
        <NavigationBar />
      <div >
        <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <main className="container mx-auto mt-10 p-4">
                <Goals />
                <AddGoal />
            </main>
            </div>
        </main>
      </div>
    </div>
  )
}
