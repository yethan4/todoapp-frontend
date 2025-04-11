import React, { useState } from 'react';
import './TaskCard.css'; 

export const TaskCard = () => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleToggle = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);
  };


  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={isCompleted}
          onChange={handleToggle}
        />
        <span className="task-title">Lorem ipsum dolor, sit amet consectetur adipisicing.</span>
      </div>
      <button 
        className="delete-btn"
        aria-label="Usuń zadanie"
      >
        ×
      </button>
    </div>
  );
};