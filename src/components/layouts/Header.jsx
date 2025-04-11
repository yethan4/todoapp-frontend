import { useState } from "react";
import { Link } from "react-router-dom"

import "./Header.css"

export const Header = () => {
  const [dropDown, setDropDown] = useState(false);

  const toggleDropDown = () => {
    setDropDown(!dropDown);
  }

  return (
    <header>
      <div className="logo">
        <Link to="/">ToDoApp</Link>
      </div>
      <div onClick={toggleDropDown} className="menu-icon">
        <i class="bi bi-list"></i>
      </div>
      {dropDown && (
        <div className="menu">
          <ul>
            <li className="user-info">
              <i className="bi bi-person-circle"></i>
              <span>email@test.com</span>
            </li>
            <li>Settings</li>
            <li>Sign out</li>
          </ul>
        </div>
      )}
    </header>
  )
}
