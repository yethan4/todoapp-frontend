import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./Sidebar.css";
import { useEffect, useState } from "react";
import { CreateList } from "../CreateList";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8000/api/lists/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setLists(response.data)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteList = async (slug) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(
        `http://localhost:8000/api/lists/${slug}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      navigate("/")
    } catch (err) {
      console.log(err)
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
    navigate(`/?date=${date.toISOString().split('T')[0]}`); 
  };

  useEffect(() => {

    fetchLists();
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('task_list')) {
      setSelectedDate(null);
    } else {
      fetchLists();
    }
  }, [location.search]);

  const activeTaskListSlug = new URLSearchParams(location.search).get('task_list');

  return (
    <section className="sidebar">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        inline
      />
      <div className="categories">
        <CreateList onListCreated={fetchLists} />
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
