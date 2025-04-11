import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./Sidebar.css";
import { useState } from "react";
import { CreateList } from "../CreateList";

export const Sidebar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <section class="sidebar">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        inline
      />
      <div className="categories">
        <CreateList />
        <ul>
          <li>
            <span>Other list</span>
            <i class="bi bi-list-task"></i>
          </li>
          <li>
            <span>Second category</span>
            <i class="bi bi-list-task"></i>
          </li>
        </ul>
      </div>
    </section>
  )
}
