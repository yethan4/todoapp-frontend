import { jwtDecode } from "jwt-decode";
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => void;
  checkLoggedInUser: () => void;
}

const contextInitialValues = {
  user: null,
  isLoggedIn: false,
  logout: () => {},
  checkLoggedInUser: () => {},
}

const AuthContext = createContext<AuthContextType>(contextInitialValues)

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  const checkLoggedInUser = async () => {
    try {
      const token:string | null = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode<{ user_id: number; email: string }>(token);
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
      const accessToken:string | null = localStorage.getItem("accessToken");
      const refreshToken:string | null = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/logout/`, 
          { refresh: refreshToken }, 
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setLoggedIn(false);
      }
    } catch (error) {
      if(axios.isAxiosError(error))
        console.error("Logout failed", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, user, checkLoggedInUser}}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);