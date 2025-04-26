import React, { useCallback, useState } from 'react';
import './TaskCard.css';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLists } from '../context/ListContext';
import { List, Task } from '../types/types';

interface Props {
  task: Task;
  onTaskDelete: (pk: number) => void;
  onTaskUpdate: (taskId: number, updates: Partial<Task>) => void;
  byDate: boolean;
  byList: boolean;
}

export const TaskCard = ({ task, onTaskDelete, onTaskUpdate, byDate, byList}: Props) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(task.completed);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(task.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    task.due_date ? new Date(task.due_date) : null
  );
  
  const [selectedTaskList, setSelectedTaskList] = useState<string>(task.task_list ?? "");
  
  const { lists } = useLists();


  const handleToggle = async (): Promise<void> => {
    const newState = !isCompleted;
    setIsLoading(true);
    setToggleError(null);

    try{
      const token: string | null = localStorage.getItem('accessToken');
      const response: any = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/tasks/${task.pk}/set-completed/`,
        { completed: newState },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setIsCompleted(response.data.completed);
    }catch(error){
      if(axios.isAxiosError(error)){
        setToggleError(
          error.response?.data?.error ||
          error.response?.data?.detail ||
          'Failed to update task status'
        )
      }
      
      setIsCompleted(!newState);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteTask = async (): Promise<void> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const token: string | null = localStorage.getItem('accessToken');
      const response: any = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/tasks/${task.pk}/delete`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if(response.status === 204)
        onTaskDelete(task.pk);
      else
        throw new Error('Unexpected response status')
    } catch(error) {
      let errorMessage = 'Failed to delete task'
      if(axios.isAxiosError(error)){
        if (error.response?.status === 401) {
          errorMessage = 'Session exipred - please login again';
        } else if (error.response?.status === 404) {
          errorMessage = 'Task not found';
        } else if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      }

      setDeleteError(errorMessage)
    } finally {
      setIsDeleting(false);
    }
  }

  const dismissError = useCallback(() => {
    setToggleError(null);
    setDeleteError(null);
  }, []);

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    setIsEditing(false);
    setSelectedDate(task.due_date ? new Date(task.due_date) : null);
    setSelectedTaskList(task.task_list ?? "");
  }

  const handleChangeTask = async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()

    if(task.task_list === selectedTaskList 
      && task.due_date === selectedDate 
      && title === task.title){
        setIsEditing(false);
        return;
      }

    try{
      const token: string | null = localStorage.getItem('accessToken');
      const newDate: string | null = selectedDate instanceof Date
      ? selectedDate.toISOString().split('T')[0]
      : selectedDate;

      const params: Partial<Task> = {
        title: title,
        completed: isCompleted,
        task_list: selectedTaskList,
        due_date: newDate
      }

      const response: any = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/tasks/${task.pk}/update/`,
        params,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        
        if ((task.task_list !== selectedTaskList) && byList)
          onTaskDelete(task.pk)
        else if ((task.due_date !== newDate) && byDate) 
          onTaskDelete(task.pk)
        else
          onTaskUpdate(task.pk, params);
          setIsEditing(false)
      };

    } catch(error) {
      if(axios.isAxiosError(error))
        setToggleError(
          error.response?.data?.error || 
          error.response?.data?.detail || 
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
                  value={selectedTaskList} 
                  onChange={(e) => setSelectedTaskList(e.target.value)}>
                  <option value=""></option>
                  {lists.map((list: List) => (
                    <option key={list.slug} value={list.slug}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='edit-btns'>
                <button 
                  type="submit"
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