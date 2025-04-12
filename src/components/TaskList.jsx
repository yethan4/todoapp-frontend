import React, { useEffect, useState } from 'react'
import { CreateTask } from './CreateTask'
import { TaskCard } from './TaskCard'

import "./TaskList.css"
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

import { useAuth } from "../context/AuthContext";

export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const date = searchParams.get('date');
      const taskList = searchParams.get('task_list');
      
      const params = {};
      if (date) params.date = date;
      if (taskList) params.task_list = taskList;
      
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });
      
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.pk !== taskId));
  };

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.pk === taskId ? { ...task, ...updates } : task
    ));
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, searchParams]); 

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }


  return (
    <section className="content">
      <CreateTask fetchTasks={fetchTasks} />

      <div className="task-list">
      {tasks.filter(task => !task.completed).map(task => (
        <TaskCard 
          key={task.pk} 
          task={task} 
          onTaskDelete={handleTaskDelete}
          onTaskUpdate={handleTaskUpdate}
        />
      ))}

      {tasks.filter(task => task.completed).map(task => (
        <TaskCard 
          key={task.pk} 
          task={task} 
          onTaskDelete={handleTaskDelete}
          onTaskUpdate={handleTaskUpdate}
        />
      ))}
    </div>
    </section>
  )
}
