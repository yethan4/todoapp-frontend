import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./Sidebar.css";
import { useState } from "react";
import { CreateList } from "../CreateList";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLists } from "../../context/ListContext";

export const Sidebar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const { lists, onListDelete } = useLists();

  const navigate = useNavigate();
  const location = useLocation();

  const handleDeleteList = async (slug: string) => {
    try {
      const token: string | null = localStorage.getItem('accessToken');

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/lists/${slug}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      onListDelete(slug);
      navigate("/")
    } catch (error) {
      if(axios.isAxiosError(error))
        console.log(error)
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  
    if(date){
      const formatted = date.toLocaleDateString('en-CA');
      navigate(`/?date=${formatted}`);
    }
  };


  const activeTaskListSlug = new URLSearchParams(location.search).get('task_list');

  return (
    <section className="sidebar">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        inline
      />
      <div className="categories">
        <CreateList />
        <ul>
          {lists.length > 0 && lists.map((list) => (
            <li 
              key={list.slug}
              className={list.slug === activeTaskListSlug ? 'active' : ''}  
            >
              <Link to={`/?task_list=${list.slug}`}>
                <span>{list.name}</span>
              </Link>
              <button 
                className="delete-btn"
                aria-label="delete category"
                onClick={() => handleDeleteList(list.slug)}
              >
                ×
              </button>
            </li>
            ))}
        </ul>
      </div>
    </section>
  )
}
