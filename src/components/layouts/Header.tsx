import { useState } from "react";
import { Link } from "react-router-dom"

import "./Header.css"
import { useAuth } from "../../context/AuthContext";

export const Header = () => {
  const [dropDown, setDropDown] = useState(false);
  const { isLoggedIn, logout, user } = useAuth();

  const toggleDropDown = () => {
    setDropDown(!dropDown);
  }

  return (
    <header>
      <div className="logo">
        <Link to="/">ToDoApp</Link>
      </div>
      { isLoggedIn && 
      <div onClick={toggleDropDown} className="menu-icon">
        <i className="bi bi-list"></i>
      </div>
      }
      {dropDown && isLoggedIn && (
        <div className="menu">
          <ul>
            <li className="user-info">
              <i className="bi bi-person-circle"></i>
              <span>{user?.email}</span>
            </li>
            <li onClick={logout}>Sign out</li>
          </ul>
        </div>
      )}
    </header>
  )
}
