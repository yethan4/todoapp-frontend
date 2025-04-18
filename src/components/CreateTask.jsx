import { useRef } from "react";
import "./CreateTask.css"
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export const CreateTask = ({ fetchTasks }) => {
  const [searchParams] = useSearchParams();
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault()

    const inputValue = inputRef.current.value

    try {
      const token = localStorage.getItem('accessToken');
      const date = searchParams.get('date');
      const taskList = searchParams.get('task_list');
      const today = new Date();
      
      const params = {
        title: inputValue,
        completed: false,
        ...(date && { due_date: date }),
        ...(taskList && { task_list: taskList }),
        ...(!date && !taskList && { due_date: today.toISOString().split('T')[0] })
      };


      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/tasks/`,
        params,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log(response)
      fetchTasks();
    } catch (err) {
      console.error('Error fetching tasks:', err);

    } finally {
      inputRef.current.value = ""
    }
  };

  return (
    <form id="create-task">
      <input 
        type="text" 
        placeholder="Add new task" 
        ref={inputRef}
      />
      <button
        onClick={handleSubmit}
      >+</button>
    </form>
  )
}
