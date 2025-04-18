import { jwtDecode } from "jwt-decode";
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const checkLoggedInUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        setUser({id: decoded.user_id, email: decoded.email}); 
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      setLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        await axios.post(`${process.env.REACT_APP_API_URL}/api/logout/`, { refresh: refreshToken }, config);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setLoggedIn(false);
        console.log("Logged out");
      }
    } catch (error) {
      console.error("Logout failed", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkLoggedInUser, logout, user}}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
