import React, { useCallback, useEffect, useState } from 'react'
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

  const date = searchParams.get('date');
  const taskList = searchParams.get('task_list');

 const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const params = {};
      if (date) params.date = date;
      if (taskList) params.task_list = taskList;
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });

      console.log(response.data)
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [taskList, date]);

  const handleTaskDelete = useCallback((taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.pk !== taskId));
  }, []);

  const handleTaskUpdate = useCallback((taskId="", updates) => {
    if(taskId) {
      setTasks(prevTasks => prevTasks.map(task => 
        task.pk === taskId ? { ...task, ...updates } : task
      ));
    } else {
      fetchTasks();
    }
  }, [fetchTasks]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, searchParams, fetchTasks]); 

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
          byDate={date || !taskList ? true : false}
          byList={taskList ? true : false}
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
