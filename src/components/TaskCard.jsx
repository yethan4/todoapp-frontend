import React, { useCallback, useState } from 'react';
import './TaskCard.css';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLists } from '../context/ListContext';

export const TaskCard = ({ task, onTaskDelete, onTaskUpdate, byDate, byList}) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isEditing, setIsEditing] = useState(false);
  const [toggleError, setToggleError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(task.due_date ? new Date(task.due_date) : null);
  const [selectedOption, setSelectedOption] = useState(task.task_list);
  const { lists } = useLists();


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
        onTaskDelete(task.pk);
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

  const dismissError = useCallback(() => {
    setToggleError(null);
    setDeleteError(null);
  }, []);

  const handleCancel = (e) => {
    e.preventDefault()
    setIsEditing(false);
    setSelectedDate(task.due_date);
    setSelectedOption(task.task_list);
  }

  const handleChangeTask = async (e) => {
    e.preventDefault()

    if(task.task_list === selectedOption && task.due_date === selectedDate && title===task.title){
      setIsEditing(false);
      return
    }

    try {
      const token = localStorage.getItem('accessToken');

      const response = await axios.patch(
        `http://localhost:8000/api/tasks/${task.pk}/update/`,
        { 
          title: title,
          completed: isCompleted,
          task_list: selectedOption,
          due_date: selectedDate && selectedDate.toISOString().split('T')[0]
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        const originalDate = task.due_date;
        const newDate = selectedDate ? selectedDate.toISOString().split('T')[0] : null;

        if ((task.task_list !== selectedOption) && byList) {
          onTaskDelete(task.pk);
        } else if ((originalDate !== newDate) && byDate) {
          onTaskDelete(task.pk);
        }
        setIsEditing(false);
      };
    } catch (err) {
      console.error('Error updating task:', err);
      setToggleError(
        err.response?.data?.error || 
        err.response?.data?.detail || 
        'Failed to update task status'
      );
    }
  }

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-header">
        <div className="task-content">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={isCompleted}
            onChange={handleToggle}
            disabled={isLoading || isDeleting}
            aria-label={isCompleted ? 'Mark task as not completed' : 'Mark task as completed'}
          />
          <input 
            className={isEditing ? "task-title is-editing" : "task-title"}
            value={title}
            readOnly={!isEditing}
            onChange={(e) => {
              if (isEditing) setTitle(e.target.value);
            }}
          />
        </div>
        
        <div className="task-actions">
          <button
            className="edit-btn"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            <i className="bi bi-pencil"></i>
          </button>
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
      

      {isEditing && (
        <form className=''>
          <div className='task-edit'>
              <div className="form-file">
                <label htmlFor="date" className="task-label">Move to another day</label>
                <DatePicker
                  id="date"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="task-date-input"
                />
              </div>
              <div>
                <label htmlFor="list">Move to another list</label>
                <select 
                  id="list" 
                  value={selectedOption} 
                  onChange={(e) => setSelectedOption(e.target.value)}>
                  <option value=""></option>
                  {lists.map((list) => (
                    <option key={list.slug} value={list.slug}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='edit-btns'>
                <button 
                  className='save-btn'
                  onClick={(e) => handleChangeTask(e)}
                >Save</button>
                <button 
                  className='cancel-btn'
                  onClick={(e) => handleCancel(e)}
                >Cancel</button>
              </div>
          </div>
        </form>
      )}
    </div>
  );
};