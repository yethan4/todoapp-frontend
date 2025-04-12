import React, { useState } from 'react';
import './TaskCard.css';
import axios from 'axios';

export const TaskCard = ({ task, onTaskDelete, onTaskUpdate}) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toggleError, setToggleError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const handleToggle = async () => {
    const newState = !isCompleted;
    setIsLoading(true);
    setToggleError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.patch(
        `http://localhost:8000/api/tasks/${task.pk}/set-completed/`,
        { completed: newState },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setIsCompleted(response.data.completed);
    } catch (err) {
      console.error('Error updating task:', err);
      setToggleError(
        err.response?.data?.error || 
        err.response?.data?.detail || 
        'Failed to update task status'
      );

      setIsCompleted(!newState);
      onTaskUpdate();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {

    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(
        `http://localhost:8000/api/tasks/${task.pk}/delete`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      
      if (response.status === 204) {
        onTaskDelete();
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      
      let errorMessage = 'Failed to delete task';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Session expired - please login again';
        } else if (err.response.status === 404) {
          errorMessage = 'Task not found';
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      }
      
      setDeleteError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const dismissError = () => {
    setToggleError(null);
    setDeleteError(null);
  };

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          disabled={isLoading || isDeleting}
          aria-label={isCompleted ? 'Mark task as not completed' : 'Mark task as completed'}
        />
        <span className="task-title">{task.title}</span>
      </div>
      
      <div className="task-actions">
        <button 
          className="delete-btn"
          onClick={handleDeleteTask}
          disabled={isLoading || isDeleting}
          aria-label="Delete task"
        >
          {isDeleting ? '...' : '×'}
        </button>
      </div>
      
      {(toggleError || deleteError) && (
        <div className="task-error">
          {toggleError || deleteError}
          <button 
            onClick={dismissError} 
            className="dismiss-error-btn"
            aria-label="Dismiss error message"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};