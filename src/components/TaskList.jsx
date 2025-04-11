import React from 'react'
import { CreateTask } from './CreateTask'
import { TaskCard } from './TaskCard'

import "./TaskList.css"

export const TaskList = () => {
  return (
    <section class="content">
      <CreateTask />

      <div className="task-list">
        <TaskCard />
        <TaskCard />
        <TaskCard />
      </div>
    </section>
  )
}
