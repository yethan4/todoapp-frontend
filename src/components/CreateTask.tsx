import { useRef } from "react";
import "./CreateTask.css"
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Task } from "../types/types";

interface Params {
  title: string;
  completed: boolean;
  due_date: string | null;
  task_list: string | null;
}

interface Props {
  onTaskAdd: (task: Task) => void;
}

export const CreateTask = ({ onTaskAdd }: Props) => {
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if(!inputRef.current?.value) return

    const inputValue: string = inputRef.current.value

    try {
      const token: string | null = localStorage.getItem('accessToken');
      const date: string | null = searchParams.get('date');
      const taskList: string | null = searchParams.get('task_list');
      const today: Date = new Date();
      
      const params: Params = {
        title: inputValue,
        completed: false,
        due_date: date ?? today.toISOString().split('T')[0],
        task_list: taskList ?? null
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

      onTaskAdd(response.data)
    } catch (error) {
      if(axios.isAxiosError(error))
        console.log(error)

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
