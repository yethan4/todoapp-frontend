import React, { useCallback, useEffect, useState } from 'react'
import { CreateTask } from './CreateTask'
import { TaskCard } from './TaskCard'

import "./TaskList.css"
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

import { useAuth } from '../context/AuthContext'
import { Task } from '../types/types'

interface Params {
  date?: string;
  task_list?: string;
}

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const date: string | null = searchParams.get('date');
  const taskListName: string | null = searchParams.get('task_list');

 const fetchTasks = useCallback(
  async (taskListName: string | null, date: string | null) => {
    try {
      const token: string | null = localStorage.getItem('accessToken');
      
      const params: Params = {
        ...(date && { date }),
        ...(taskListName && { task_list: taskListName })
      }
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });

      console.log(response.data)
      setTasks(response.data);

    } catch (error) {
      if(axios.isAxiosError(error))
        setError(error.response?.data?.message || 'Failed to fetch tasks');

    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddTask = useCallback((task: Task) => {
    setTasks(prevTasks => [...prevTasks, task])
  }, [])

  const handleTaskDelete = useCallback((taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.pk !== taskId));
  }, []);

  const handleTaskUpdate = useCallback((taskId: number, updates: Partial<Task>) => {
    if(taskId) {
      setTasks(prevTasks => prevTasks.map(task => 
        task.pk === taskId ? { ...task, ...updates } : task
      ));
    } else {
      fetchTasks(taskListName, date);
    }
  }, [fetchTasks, taskListName, date]);

  useEffect(() => {
    if (user) {
      fetchTasks(taskListName, date);
    }
  }, [user, taskListName, date, fetchTasks]); 

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="content">
      <CreateTask onTaskAdd={handleAddTask} />

      <div className="task-list">
      {tasks.filter(task => !task.completed).map(task => (
        <TaskCard 
          key={task.pk} 
          task={task} 
          onTaskDelete={handleTaskDelete}
          onTaskUpdate={handleTaskUpdate}
          byDate={date || !taskListName ? true : false}
          byList={taskListName ? true : false}
        />
      ))}

      {tasks.filter(task => task.completed).map(task => (
        <TaskCard 
          key={task.pk} 
          task={task}
          onTaskDelete={handleTaskDelete}
          onTaskUpdate={handleTaskUpdate}
          byDate={date || !taskListName ? true : false}
          byList={taskListName ? true : false}
        />
      ))}
    </div>
    </section>
  )
}
